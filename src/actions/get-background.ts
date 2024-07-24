export const getBackground = (code: number) => {
  const sunny = [1000];
  const cloudy = [1003, 1006, 1009, 1030, 1135, 1147];

  if (code === 0) {
    return { background: 'linear-gradient(#090979, #020024)' };
  }

  if (sunny.includes(code)) {
    return { background: 'linear-gradient(#eca924, #ef6212)' };
  } else if (cloudy.includes(code)) {
    return { background: 'linear-gradient(#3b74bb, #2d3e90)' };
  } else {
    return { background: 'linear-gradient(#a6bacd, #494c6b)' };
  }
};
