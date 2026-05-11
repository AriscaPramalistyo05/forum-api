export const up = (pgm) => {
  pgm.addColumn('threads', {
    date: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('NOW()'),
    },
  });

  pgm.addColumn('comments', {
    date: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('NOW()'),
    },
  });
};

export const down = (pgm) => {
  pgm.dropColumn('threads', 'date');
  pgm.dropColumn('comments', 'date');
};
