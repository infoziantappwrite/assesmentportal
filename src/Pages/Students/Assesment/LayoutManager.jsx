import React, { useState } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const LayoutManager = ({
  renderHeader,
  renderLegend,
  renderQuestionPalette,
  renderQuestionContent,
}) => {
  const [layout, setLayout] = useState([
    { i: 'header', x: 0, y: 0, w: 8, h: 2, minH: 1 },
    { i: 'legend', x: 0, y: 2, w: 2, h: 4, minH: 2 },
    { i: 'palette', x: 2, y: 2, w: 3, h: 4, minH: 2 },
    { i: 'question', x: 5, y: 2, w: 3, h: 4, minH: 2 },
  ]);

  const components = {
    header: renderHeader(),
    legend: renderLegend(),
    palette: renderQuestionPalette(),
    question: renderQuestionContent(),
  };

  return (
    <div className="">
      <GridLayout
        className="layout"
        layout={layout}
        cols={8}
        rowHeight={50}
        width={1200}
        onLayoutChange={setLayout}
        isDraggable
        isResizable
        compactType={null}
        preventCollision={false}
        useCSSTransforms={true}
      >
        {layout.map((item) => (
          <div
            key={item.i}
            className="bg-white rounded-lg border border-gray-200  overflow-auto"
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <div className=" flex-grow overflow-auto ">{components[item.i]}</div>
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default LayoutManager;
