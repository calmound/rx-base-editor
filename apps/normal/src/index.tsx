import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { EditorRender, useEditor } from '@gitee/tide';
import { StarterKit } from '@gitee/tide-starter-kit';
import { TextAlign } from '@tiptap/extension-text-align';
import { ThemeContextProvider } from './contexts/ThemeContext';
import HeaderBar from './components/HeaderBar';
import { MentionMember } from './components/Editor/extensions/mention-member';
import {
  mockFetchMemberMentionDebounced,
  mockImgUploader,
} from './components/Editor/utils';
import Preview from './components/Preview';
import { Editor } from '@tiptap/core';

import '@gitee/tide/dist/style.css';
import 'highlight.js/styles/a11y-light.css';
import './index.less';
import './preview.less';

console.log('BUILD_TIME：', __BUILD_TIME__);
let previewEditor = null;

function App() {
  const previewRef = useRef();
  const [bgHeight, setBgHeight] = useState(0);

  const editor = useEditor({
    autofocus: true,
    extensions: [
      StarterKit.configure({
        textAlign: false,
        taskItem: {
          onReadOnlyChecked: () => true,
        },
        uploader: {
          image: {
            uploader: mockImgUploader,
          },
        },
      }),
      TextAlign.extend({
        addKeyboardShortcuts: () => ({}),
      }).configure({
        types: ['heading', 'paragraph'],
      }),
      MentionMember.configure({
        suggestion: {
          items: ({ query }) => mockFetchMemberMentionDebounced(query),
        },
      }),
    ],
    readOnlyEmptyView: (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <p>暂无内容（只读模式）</p>
      </div>
    ),
  });

  const editorContent = useMemo(() => {
    return editor?.getJSON() || [];
  }, [editor?.getJSON()]);

  // useEffect(() => {
  //   if (!previewEditor) {
  //     previewEditor = new Editor({
  //       element: document.querySelector('.preview-editor'),
  //       extensions: [StarterKit],
  //       content: editorContent,
  //     });
  //   } else {
  //     previewEditor?.commands.setContent(editorContent);

  //     setBgHeight(previewRef.current.scrollHeight);
  //   }
  // }, [editorContent]);

  return (
    <ThemeContextProvider>
      <div className="demo">
        <div className="demo-header">
          <HeaderBar editor={editor} />
        </div>
        <div className="demo-main">
          <div className="demo-editor-wrapper">
            <EditorRender editor={editor} />
          </div>
          <div>
            <button>预览</button>
            <button>图片下载</button>
          </div>
          {/* <div className="demo-inspect">
            <div className="preview-editor" ref={previewRef}>
              {Array(Math.ceil(bgHeight / 534))
                .fill(1)
                .map((item, index) => (
                  <div className="bg-divide" style={{ top: index * 534 }}></div>
                ))}
            </div>
          </div> */}
        </div>
      </div>
    </ThemeContextProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
