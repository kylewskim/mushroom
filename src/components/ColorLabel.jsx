const ColorLabel = (props) => {
  const buttonStyle = {
    backgroundColor: "white",
    color: props.color === "black" ? "white" : "black",
    padding: "8px 12px",
    margin: "4px",
    cursor: "pointer",
    border: `1px solid black`, // Set border with the same color as the button
    boxShadow: "none", // Remove box-shadow
    fontWeight: props.bold ? "bold" : "normal", // Apply bold style when bold prop is true
  };

  return <div style={buttonStyle}>{props.label}</div>;
};

export default ColorLabel;
