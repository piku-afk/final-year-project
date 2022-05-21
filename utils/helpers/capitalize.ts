const capitalizeFirstWord = (input: string) => {
  return (input && input[0].toUpperCase() + input.slice(1)) || '';
};

export const capitalize = (input: string) => {
  const separator = ' ';
  return input
    .split(separator)
    .map((item) => capitalizeFirstWord(item))
    .join(separator);
};
