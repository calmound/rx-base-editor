import React, { forwardRef, useImperativeHandle } from 'react';
import ReactDOM from 'react-dom';
import {
  TideEditor,
  EditorRender,
  TideEditorOptions,
  useEditor,
} from '@gitee/tide';
import { StarterKit } from '@gitee/tide-starter-kit';
import { LegacyExtOpts } from './type';

import html2canvas from 'html2canvas';

import {
  EditorRemoteDataProvider,
  MentionMember,
  MentionIssue,
  MentionPullRequest,
} from '@gitee/tide-presets-mentions';
import { pulls, issues, members } from './mentionLink';

import '@gitee/tide/dist/style.css';
import '@gitee/tide-presets-mentions/dist/style.css';

import 'highlight.js/styles/default.css';

export type LegacyTideEditorProps = Partial<
  Omit<TideEditorOptions, 'extensions'>
> &
  LegacyExtOpts;

const LegacyTideEditor = forwardRef<TideEditor, LegacyTideEditorProps>(
  ({ ...props }, ref) => {
    const { imageUpload, fetchResources, mention, ...restProps } = props;

    const editor = useEditor({
      ...restProps,
      extensions: [
        StarterKit.configure({
          taskItem: {
            onReadOnlyChecked: () => true,
          },
          uploader: {
            image: {
              uploader: imageUpload,
            },
          },
        }),
        MentionMember.configure({
          suggestion: {
            items: ({ query }) => mention.fetchMentionMember(query),
          },
          getLink: members.getLink,
        }),
        MentionIssue.configure({
          suggestion: {
            items: ({ query }) => mention.fetchMentionIssue(query),
          },
          getLink: issues.getLink,
        }),
        MentionPullRequest.configure({
          suggestion: {
            items: ({ query }) => mention.fetchMentionPR(query),
          },
          getLink: pulls.getLink,
        }),
      ],
    });

    useImperativeHandle(ref, () => editor as TideEditor, [editor]);
    return (
      <EditorRemoteDataProvider fetchResources={fetchResources}>
        <span
          onClick={() => {
            editor.setEditable(false);
          }}
        >
          只读
        </span>
        <span
          onClick={() => {
            const width = 341;
            const height = 534;
            let scrollTop = 0;
            const offsetHeight =
              document.querySelector('.tide-content')?.offsetHeight;
            for (; scrollTop < offsetHeight; scrollTop += height) {
              html2canvas(document.querySelector('.tide-content'), {
                height: height,
                width: width,
                y: scrollTop,
                scale: 2,
              }).then((canvas) => {
                document.body.appendChild(canvas);
                const link = document.createElement('a');
                link.download = 'filename.png';
                link.href = canvas.toDataURL();
                link.click();
              });
            }
          }}
        >
          download image
        </span>
        <EditorRender editor={editor} />
      </EditorRemoteDataProvider>
    );
  }
);

LegacyTideEditor.displayName = 'TideEditor';

export const createEditor = (props: {
  el: HTMLElement;
  options: LegacyTideEditorProps;
}): void => {
  const { el, options } = props;
  ReactDOM.render(<LegacyTideEditor {...options} />, el);
};
