declare module 'react-vertical-timeline-component' {
  import { ReactNode } from 'react';

  export interface VerticalTimelineElementProps {
    className?: string;
    date?: string;
    dateClassName?: string;
    iconClassName?: string;
    iconOnClick?: () => void;
    icon?: ReactNode;
    iconStyle?: React.CSSProperties;
    position?: string;
    style?: React.CSSProperties;
    textClassName?: string;
    contentStyle?: React.CSSProperties;
    contentArrowStyle?: React.CSSProperties;
    visible?: boolean;
    children?: ReactNode;
  }

  export interface VerticalTimelineProps {
    animate?: boolean;
    className?: string;
    layout?: '1-column' | '2-columns';
    lineColor?: string;
    children?: ReactNode;
  }

  export const VerticalTimeline: React.FC<VerticalTimelineProps>;
  export const VerticalTimelineElement: React.FC<VerticalTimelineElementProps>;
}