import React from 'react';

import { ProgressStepsBox } from './StepsStyle'
interface Step {
    index:number;
    icon: any;
    title: string;
    description?: any;
    completed?: boolean;
}

const StepItem: React.FC<Step> = ({index, icon, title, description, completed }) => (
  <div className={`step ${completed ? 'completed' : ''}`}>
    <div className="step-left">
        <div className="step-index">{icon}</div>
        <div className="step-line"></div>
    </div>
    <div className="step-right">

        <div className="title">{title}</div>
        {description && <div className="description">{description}</div>}
    </div>
  </div>
);

interface StepsProps {
  steps: Step[];
}


// { title: '第三步', description: '这是描述文字', completed: true }
const Steps: React.FC<StepsProps> = ({ steps }) => (
  <ProgressStepsBox className="stepper">
    {steps.map((step, index) => (
      <StepItem key={index} {...step} index={index}/>

      ))}
  </ProgressStepsBox>
);

export default Steps;