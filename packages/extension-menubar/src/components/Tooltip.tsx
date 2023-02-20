import Tippy, { TippyProps } from '@tippyjs/react';

export type TooltipProps = TippyProps & {
  text?: string;
};

export const Tooltip: React.FC<TooltipProps> = ({
  text,
  content,
  children,
  ...props
}) => {
  return (
    <Tippy
      interactive
      content={content || <div className={'gwe-menu-bar__tooltip'}>{text}</div>}
      {...props}
    >
      {children}
    </Tippy>
  );
};
