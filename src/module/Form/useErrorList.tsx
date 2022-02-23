import React, { ReactNode } from 'react';

export interface ErrorListProps {
  errors: ReactNode[];
}

const useErrorList = () => {
  const ErrorList = (props: ErrorListProps) => {
    const { errors } = props;
    return (
      <React.Fragment>
        {
          errors?.map((item: ReactNode, index: number) => (
            <div key={index} className={`FormList-error`}>{item}</div>
          ))
        }
      </React.Fragment>
    )
  }

  return [ErrorList];
}

export default useErrorList;