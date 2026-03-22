import React from 'react';
import styles from './Card.module.css';

const Card = ({ header, footer, children, className }) => {
  return (
    <div className={`${styles.card} ${className || ''}`}>
      {header && <div className={styles.cardHeader}>{header}</div>}
      <div className={styles.cardBody}>{children}</div>
      {footer && <div className={styles.cardFooter}>{footer}</div>}
    </div>
  );
};

export default Card;