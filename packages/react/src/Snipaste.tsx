import React, { useEffect, useState } from 'react';
import { Resizable, ResizableBox } from 'react-resizable';

import './Snipaste.less';

const Snipaste = ({ snipaste = {} }) => {
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(100);

  const { ratio } = snipaste;

  useEffect(() => {
    // const height = document.querySelector('.tide-content')?.scrollHeight || 0;
    const width = document.querySelector('.tide-content')?.offsetWidth || 0;
    setWidth(width);

    let height = 0;
    switch (ratio) {
      case '3/4':
        height = (width * 4) / 3;
      case '4/3':
        height = (width * 3) / 4;
      case '1/1':
        height = width;
      default:
        height = (width * 4) / 3;
    }
    setHeight(height);
  }, []);

  const handleResize = () => {};
  return (
    <>
      {/* <>
        <ResizableBox
          width={200}
          height={200}
          // minConstraints={[100, 100]}
          maxConstraints={[398, 600]}
          style={{
            width: width,
            height: height,
            opacity: 0.2,
            background: 'rgba(154 169 223)',
            // maxConstraints: [300, 300],
          }}
        ></ResizableBox>
      </> */}
      <div
        style={{
          position: 'fixed',
          top: 118,
          width,
          height,
          background: 'rgba(156 ,180 ,240 , 0.2)',
        }}
      ></div>
      <div className="bg-divide-wrap">
        {/* {Array(Math.ceil(bgHeight / 534))
          .fill(1)
          .map((item, index) => (
            <div className="bg-divide" style={{ top: index * 534 }}></div>
          ))} */}
      </div>
    </>
  );
};

export default Snipaste;
