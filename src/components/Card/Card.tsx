import React from 'react';
import './Card.css';

export type ZyrnCardVariant = 'parchment' | 'charcoal' | 'vermilion';

export interface ZyrnCardProps extends React.HTMLAttributes<HTMLDivElement> {
  titleText?: string;
  subText?: string;
  kanjiStamp?: string;
  variant?: ZyrnCardVariant;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const VARIANT_CLASS: Record<ZyrnCardVariant, string> = {
  charcoal: 'zyrn-card--charcoal',
  parchment: 'zyrn-card--parchment',
  vermilion: 'zyrn-card--vermilion',
};

export const ZyrnCard = React.forwardRef<HTMLDivElement, ZyrnCardProps>(function ZyrnCard(
  {
    titleText,
    subText,
    kanjiStamp,
    variant = 'charcoal',
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const hasHeader = Boolean(titleText || subText);
  const rootClass = ['zyrn-card', VARIANT_CLASS[variant], className].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={rootClass} style={style} {...rest}>
      {kanjiStamp && (
        <span className="zyrn-card-stamp" aria-label={kanjiStamp}>
          {kanjiStamp}
        </span>
      )}

      {hasHeader && (
        <div className="zyrn-card-header">
          {titleText && <h3 className="zyrn-card-title">{titleText}</h3>}
          {subText && <p className="zyrn-card-subtext">{subText}</p>}
        </div>
      )}

      {children && <div className="zyrn-card-body">{children}</div>}
    </div>
  );
});

ZyrnCard.displayName = 'ZyrnCard';

export default ZyrnCard;
