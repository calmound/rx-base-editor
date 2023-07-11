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
import { Button, Checkbox, Space, Dropdown } from 'antd';
import html2canvas from 'html2canvas';

import '@gitee/tide/dist/style.css';
import 'highlight.js/styles/a11y-light.css';
import './index.less';
import './preview.less';

console.log('BUILD_TIME：', __BUILD_TIME__);
let previewEditor = null;

function App() {
  const previewRef = useRef();
  const [bgHeight, setBgHeight] = useState(0);
  const [divideVis, setDivideVis] = useState(false);
  const [preview, setPreview] = useState(false);

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

  useEffect(() => {
    setBgHeight(document.querySelector('.tide-content')?.scrollHeight || 0);
  }, [editorContent]);

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
            <Space>
              <Checkbox onChange={(e) => setDivideVis(e.target.checked)} />
              比例尺展示
              <Button>预览</Button>
              <Button
                onClick={() => {
                  html2canvas(document.querySelector('.ProseMirror'), {
                    height: (398 * 4) / 3,
                    width: 398,
                    y: document.querySelector('.tide-content')?.scrollTop,
                    scale: 2,
                  }).then((canvas) => {
                    document.body.appendChild(canvas);
                    const link = document.createElement('a');
                    link.download = 'filename.png';
                    link.href = canvas.toDataURL();
                    link.click();
                  });
                }}
              >
                图片下载
              </Button>
              <Dropdown
                menu={{
                  onClick: (e) => {
                    console.log(e);
                  },
                  items: [
                    {
                      key: '3/4',
                      label: <> 3:4 比例</>,
                    },
                    {
                      key: '1/1',
                      label: <> 1:1 比例</>,
                    },
                    {
                      key: '4/3',
                      label: <> 4:3 比例</>,
                    },
                  ],
                }}
              >
                <Button>自定义裁剪</Button>
              </Dropdown>
            </Space>
          </div>
          {/* <div className="demo-inspect">
            <div className="preview-editor" ref={previewRef}>
              {divideVis && Array(Math.ceil(bgHeight / 534))
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
