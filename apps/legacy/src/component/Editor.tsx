import classNames from 'classnames';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import ReactDOM from 'react-dom';
import type { Plugin } from '@tiptap/pm/state';
import type { JSONContent } from '@tiptap/core';
import {
  MarkdownEditor,
  createMarkdownEditor,
} from '@gitee/wysiwyg-editor-markdown';
import type {
  MarkdownEditorOptions,
  Content,
} from '@gitee/wysiwyg-editor-markdown';
import {
  Editor as TEditor,
  EditorContent as TEditorContent,
  useEditor,
} from '@gitee/wysiwyg-editor-react';
import { getExtensions } from './extensions';

export type EditorContentProps = {
  className?: string;
  style?: React.CSSProperties | undefined;
  defaultValue?: Content | undefined;
  value?: Content | undefined;
  autoFocus?: boolean;
  readOnly?: boolean;
  readOnlyEmptyView?: React.ReactNode;
  children?: React.ReactNode;
  onChange?: (doc: JSONContent, editor: MarkdownEditor) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onReady?: (editor: MarkdownEditor) => void;
  onImageUploading?: (isUploading: boolean) => void;
};

const MarkdownEditorClass = createMarkdownEditor(TEditor);

const Editor = forwardRef<MarkdownEditor, EditorContentProps>(
  (
    {
      className,
      style,
      autoFocus = false,
      readOnly,
      readOnlyEmptyView,
      children,
      onChange,
      onFocus,
      onBlur,
      onReady,
    },
    ref
  ) => {
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const onFocusRef = useRef(onFocus);
    onFocusRef.current = onFocus;
    const onBlurRef = useRef(onBlur);
    onBlurRef.current = onBlur;
    const onReadyRef = useRef(onReady);
    onReadyRef.current = onReady;

    const editor = useEditor<MarkdownEditor, MarkdownEditorOptions>(
      MarkdownEditorClass,
      {
        markdown: {
          linkify: true,
          breaks: true,
          tightLists: true,
        },
        extensions: getExtensions(),
        autofocus: autoFocus,
        editable: !readOnly,
        editorProps: {
          attributes: {
            spellCheck: 'false',
          },
        },
        onCreate: ({ editor: e }) => {
          const { state, view } = e;
          // 调整 suggestion 插件的优先级 (解决 # 与 heading input rule 冲突的问题)
          if (state.plugins.length > 0) {
            const restOfPlugins: Plugin[] = [];
            const suggestionPlugins: Plugin[] = [];
            state.plugins.forEach((plugin) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore: The `Plugin` type does not include `key`
              if ((plugin.key as string).includes('Suggestion')) {
                suggestionPlugins.push(plugin);
              } else {
                restOfPlugins.push(plugin);
              }
            });
            view.updateState(
              state.reconfigure({
                plugins: [...suggestionPlugins, ...restOfPlugins],
              })
            );
          }
          onReadyRef.current?.(e as MarkdownEditor);
        },
        onFocus: () => {
          onFocusRef.current?.();
        },
        onBlur: () => {
          onBlurRef.current?.();
        },
      },
      []
    );

    useEffect(() => {
      if (!editor || editor.isEditable === !readOnly) return;
      editor.setEditable(!readOnly);
    }, [readOnly]);

    useImperativeHandle(ref, () => editor as MarkdownEditor, [editor]);

    const fullClassName = classNames('gwe-content', className);

    if (editor && editor.isEmpty && !editor.isEditable) {
      return <div className={fullClassName}>{readOnlyEmptyView || null}</div>;
    }

    return (
      <TEditorContent
        className={fullClassName}
        style={style}
        editor={editor as unknown as TEditor}
      >
        {children}
      </TEditorContent>
    );
  }
);

export default Editor;