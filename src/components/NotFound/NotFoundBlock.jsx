import React from 'react';

import styles from './NotFoundBlock.module.scss';

console.log(styles);

const NotFoundBlock = () => {
  return (
    <div>
      <h1 className={styles.root}>Ничего не найдено</h1>
    </div>
  );
};

export default NotFoundBlock;
