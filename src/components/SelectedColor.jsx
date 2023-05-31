import xlogo from "../assets/X.png";
const SelectedColorBox = (props) => {
  const buttonStyle = {
    backgroundColor: props.color,
    color: props.color === "black" ? "white" : "black",
    padding: "8px 12px",
    margin: "4px",
    cursor: "pointer",
    border: `1px solid black`, // Set border with the same color as the button
    boxShadow: "none", // Remove box-shadow
    fontWeight: props.bold ? "bold" : "normal", // Apply bold style when bold prop is true
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  };

  return (
    <div style={buttonStyle}>
      {props.label}
      <img
        src={xlogo}
        alt={"x"}
        onClick={() => props.onClick(props.color)}
        style={{height: "10px", width: "10px", marginLeft: "10px"}}
      />
    </div>
  );
};

export default SelectedColorBox;
