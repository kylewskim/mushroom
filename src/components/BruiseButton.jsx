const BruiseButton = (props) => {
  const buttonStyle = {
    backgroundColor: props.selected === props.label ? "black" : "white",
    color: props.selected === props.label ? "white" : "black",
    padding: "8px 12px",
    margin: "4px",
    cursor: "pointer",
    border: `1px solid black`, // Set border with the same color as the button
    boxShadow: "none", // Remove box-shadow
    fontWeight: props.bold ? "bold" : "normal", // Apply bold style when bold prop is true
  };

  return (
    <button style={buttonStyle} onClick={() => props.onClick(props.color)}>
      {props.label}
    </button>
  );
};

export default BruiseButton;
