const SelectorButton = (props) => {
  const buttonStyle = {
    backgroundColor: props.color,
    color: props.color === "black" ? "white" : "black",
    padding: "8px 12px",
    margin: "4px",
    cursor: "pointer",
    border: `1px solid black`, // Set border with the same color as the button
    boxShadow: "none", // Remove box-shadow
    fontWeight: props.label === props.selected ? "bold" : "normal", // Apply bold style when bold prop is true
  };

  return (
    <button
      style={buttonStyle}
      disabled={props.disabled}
      onClick={() => props.onClick(props.color)}
    >
      {props.label}
    </button>
  );
};

export default SelectorButton;
