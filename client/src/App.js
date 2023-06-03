import React, {useEffect, useState} from "react";
import "./App.css";
import SelectorButton from "./components/SelectorButton";
import {colors} from "./utils/color";
import nextLogo from "./assets/Next.png";
import ColorLabel from "./components/ColorLabel";
import SelectedColorBox from "./components/SelectedColor";

function App() {
  const [curColor, setCurColor] = useState({name: "", color: "", tag: ""});
  const [curState, setCurState] = useState("");
  const [selectedColor, setSelectedColor] = useState({
    capColor: {isSelected: false, color: "", name: "", tag: ""},
    gillColor: {isSelected: false, color: "", name: "", tag: ""},
    ringType: {isSelected: false, color: "", name: "", tag: ""},
    stalkColorAbv: {isSelected: false, color: "", name: "", tag: ""},
    stalkColorBlw: {isSelected: false, color: "", name: "", tag: ""},
    stalkColor: {isSelected: false, color: "", name: "", tag: ""},
    veilColor: {isSelected: false, color: "", name: "", tag: ""},
    bruise: {isSelected: false, color: "", name: "", tag: ""},
  });
  const [ready, setReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [isStart, setIsStart] = useState(true);

  const callResult = async () => {
    setResult("");
    const selectedCapColor = selectedColor.capColor.tag;
    const selectedBruise = selectedColor.bruise.tag;
    const selectedGillColor = selectedColor.gillColor.tag;
    const selectedStalkColorAbv = Object.keys(selectedColor).includes(
      "stalkColor"
    )
      ? selectedColor.stalkColor.tag
      : selectedColor.stalkColorAbv.tag;
    const selectedStalkColorBlw = Object.keys(selectedColor).includes(
      "stalkColor"
    )
      ? selectedColor.stalkColor.tag
      : selectedColor.stalkColorBlw.tag;
    const selectedRingType = selectedColor.ringType.tag;
    const selectedVeilColor = selectedColor.veilColor.tag;

    const formData = {
      capColorTag: selectedCapColor,
      bruiseTag: selectedBruise,
      gillColorTag: selectedGillColor,
      stalkColorAbvTag: selectedStalkColorAbv,
      stalkColorBlwTag: selectedStalkColorBlw,
      ringTypeTag: selectedRingType,
      veilColorTag: selectedVeilColor,
    };

    const formDataValues = Object.values(formData);

    setIsLoading(true);

    await fetch("/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(formDataValues),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((response) => {
        console.log(response.result);
        setResult(response.result);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleColorSelect = (color, state) => {
    console.log(color);
    setCurColor(color);
    setCurState(state);
  };

  const handleStartState = (status, state) => {
    setIsStart(status);
    setCurState(state);
  };

  const handleColorReset = (state) => {
    state === "ringType"
      ? setSelectedColor((prevState) => ({
          capColor: prevState["capColor"],
          gillColor: prevState["gillColor"],
          ringType: {isSelected: false, color: "", name: "", tag: ""},
          stalkColorAbv: {isSelected: false, color: "", name: "", tag: ""},
          stalkColorBlw: {isSelected: false, color: "", name: "", tag: ""},
          stalkColor: {isSelected: false, color: "", name: "", tag: ""},
          veilColor: prevState["veilColor"],
          bruise: prevState["bruise"],
        }))
      : setSelectedColor((prevState) => ({
          ...prevState,
          [state]: {
            isSelected: false,
            color: "",
            name: "",
            tag: "",
          },
        }));
    setCurColor({name: "", color: "", tag: ""});
    setCurState(state);
  };

  const handleBruise = (color) => {
    setSelectedColor((prevState) => ({
      ...prevState,
      bruise: {
        isSelected: true,
        color: color.color,
        name: color.name,
        tag: color.tag,
      },
    }));
    setReady(true);
  };

  const handleButtonClick = () => {
    setSelectedColor((prevState) => {
      let updatedSelectedColor = {...prevState};

      if (curState === "ringType" && curColor.name === "none") {
        updatedSelectedColor = Object.fromEntries(
          Object.entries(updatedSelectedColor).filter(
            ([key]) => key !== "stalkColorAbv" && key !== "stalkColorBlw"
          )
        );
      } else if (curState === "ringType" && curColor.name !== "none") {
        updatedSelectedColor = Object.fromEntries(
          Object.entries(updatedSelectedColor).filter(
            ([key]) => key !== "stalkColor"
          )
        );
      }

      const updatedColor = {
        isSelected: true,
        color: curColor.color,
        name: curColor.name,
        tag: curColor.tag,
      };

      updatedSelectedColor[curState] = updatedColor;

      const colorKeys = Object.keys(updatedSelectedColor);
      const nextFalseKey = colorKeys.find(
        (key) => !updatedSelectedColor[key].isSelected
      );
      setCurState(nextFalseKey);

      return updatedSelectedColor;
    });

    setCurColor({name: "", color: "", tag: ""});
  };

  const handleReset = () => {
    setCurColor({name: "", color: "", tag: ""});
    setCurState("");
    setSelectedColor({
      capColor: {isSelected: false, color: "", name: "", tag: ""},
      gillColor: {isSelected: false, color: "", name: "", tag: ""},
      ringType: {isSelected: false, color: "", name: "", tag: ""},
      stalkColorAbv: {isSelected: false, color: "", name: "", tag: ""},
      stalkColorBlw: {isSelected: false, color: "", name: "", tag: ""},
      stalkColor: {isSelected: false, color: "", name: "", tag: ""},
      veilColor: {isSelected: false, color: "", name: "", tag: ""},
      bruise: {isSelected: false, color: "", name: "", tag: ""},
    });
    setReady(false);
    setIsLoading(false);
    setResult();
  };

  return (
    <div
      style={{
        backgroundColor:
          result === "e" ? "green" : result === "p" ? "red" : curColor.color,
        display: "flex",
        height: "100vh",
        alignItems: "flex-start",
        flexDirection: "column",
      }}
    >
      <div
        style={{display: "flex", alignItems: "flex-start", flexWrap: "wrap"}}
      >
        <SelectorButton
          label={"Can I eat this mushroom?"}
          color={"white"}
          onClick={() => {
            handleStartState(false, "Start");
          }}
        />

        {isStart === false && <ColorLabel label={"cap-color"} />}
        {isStart === false &&
          (selectedColor.capColor.isSelected ? (
            <SelectedColorBox
              label={selectedColor.capColor.name}
              color={selectedColor.capColor.color}
              tag={selectedColor.capColor.tag}
              onClick={() => handleColorReset("capColor")}
            />
          ) : (
            colors["capColor"].map((color) => {
              return (
                <SelectorButton
                  key={color.name}
                  label={color.name}
                  color={color.color}
                  tag={color.tag}
                  onClick={() => handleColorSelect(color, "capColor")}
                  onclick={() => console.log(color.tag)}
                  selected={curColor.name}
                />
              );
            })
          ))}

        {(curState === "gillColor" || selectedColor.gillColor.isSelected) && (
          <ColorLabel label={"gill-color"} />
        )}

        {curState === "gillColor" || selectedColor.gillColor.isSelected ? (
          selectedColor.gillColor.isSelected ? (
            <SelectedColorBox
              label={selectedColor.gillColor.name}
              color={selectedColor.gillColor.color}
              tag={selectedColor.gillColor.tag}
              onClick={() => handleColorReset("gillColor")}
            />
          ) : (
            colors["gillColor"].map((color) => (
              <SelectorButton
                key={color.name}
                label={color.name}
                color={color.color}
                onClick={() => handleColorSelect(color, "gillColor")}
                selected={curColor.name}
              />
            ))
          )
        ) : null}

        {(curState === "ringType" || selectedColor.ringType.isSelected) && (
          <ColorLabel label={"ring-type"} />
        )}

        {curState === "ringType" || selectedColor.ringType.isSelected ? (
          selectedColor.ringType.isSelected ? (
            <SelectedColorBox
              label={selectedColor.ringType.name}
              color={selectedColor.ringType.color}
              onClick={() => handleColorReset("ringType")}
            />
          ) : (
            colors["ringType"].map((color) => (
              <SelectorButton
                key={color.name}
                label={color.name}
                color={color.color}
                onClick={() => handleColorSelect(color, "ringType")}
                selected={curColor.name}
              />
            ))
          )
        ) : null}

        {selectedColor.ringType.name !== "none" &&
          (curState === "stalkColorAbv" ||
            selectedColor.stalkColorAbv.isSelected) && (
            <ColorLabel label={"stalk-color-abv"} />
          )}

        {selectedColor.ringType.name !== "none" &&
          (curState === "stalkColorAbv" ||
          selectedColor.stalkColorAbv.isSelected ? (
            selectedColor.stalkColorAbv.isSelected ? (
              <SelectedColorBox
                label={selectedColor.stalkColorAbv.name}
                color={selectedColor.stalkColorAbv.color}
                onClick={() => handleColorReset("stalkColorAbv")}
              />
            ) : (
              colors["stalkColorAbv"].map((color) => (
                <SelectorButton
                  key={color.name}
                  label={color.name}
                  color={color.color}
                  onClick={() => handleColorSelect(color, "stalkColorAbv")}
                  selected={curColor.name}
                />
              ))
            )
          ) : null)}

        {selectedColor.ringType.name !== "none" &&
          (curState === "stalkColorBlw" ||
            selectedColor.stalkColorBlw.isSelected) && (
            <ColorLabel label={"stalk-color-blw"} />
          )}

        {selectedColor.ringType.name !== "none" &&
          (curState === "stalkColorBlw" ||
          selectedColor.stalkColorBlw.isSelected ? (
            selectedColor.stalkColorBlw.isSelected ? (
              <SelectedColorBox
                label={selectedColor.stalkColorBlw.name}
                color={selectedColor.stalkColorBlw.color}
                onClick={() => handleColorReset("stalkColorBlw")}
              />
            ) : (
              colors["stalkColorBlw"].map((color) => (
                <SelectorButton
                  key={color.name}
                  label={color.name}
                  color={color.color}
                  onClick={() => handleColorSelect(color, "stalkColorBlw")}
                  selected={curColor.name}
                />
              ))
            )
          ) : null)}

        {selectedColor.ringType.name === "none" &&
          (curState === "stalkColor" ||
            selectedColor.stalkColor.isSelected) && (
            <ColorLabel label={"stalk-color"} />
          )}

        {selectedColor.ringType.name === "none" &&
          (curState === "stalkColor" || selectedColor.stalkColor.isSelected ? (
            selectedColor.stalkColor.isSelected ? (
              <SelectedColorBox
                label={selectedColor.stalkColor.name}
                color={selectedColor.stalkColor.color}
                onClick={() => handleColorReset("stalkColor")}
              />
            ) : (
              colors["stalkColor"].map((color) => (
                <SelectorButton
                  key={color.name}
                  label={color.name}
                  color={color.color}
                  onClick={() => handleColorSelect(color, "stalkColor")}
                  selected={curColor.name}
                />
              ))
            )
          ) : null)}

        {(curState === "veilColor" || selectedColor.veilColor.isSelected) && (
          <ColorLabel label={"veil-color"} />
        )}

        {curState === "veilColor" || selectedColor.veilColor.isSelected ? (
          selectedColor.veilColor.isSelected ? (
            <SelectedColorBox
              label={selectedColor.veilColor.name}
              color={selectedColor.veilColor.color}
              onClick={() => handleColorReset("veilColor")}
            />
          ) : (
            colors["veilColor"].map((color) => (
              <SelectorButton
                key={color.name}
                label={color.name}
                color={color.color}
                onClick={() => handleColorSelect(color, "veilColor")}
                selected={curColor.name}
              />
            ))
          )
        ) : null}

        {(curState === "bruise" || selectedColor.bruise.isSelected) && (
          <ColorLabel label={"bruise"} />
        )}

        {curState === "bruise" || selectedColor.bruise.isSelected ? (
          selectedColor.bruise.isSelected ? (
            <SelectedColorBox
              label={selectedColor.bruise.name}
              color={selectedColor.bruise.color}
              onClick={() => handleColorReset("bruise")}
            />
          ) : (
            colors["bruise"].map((color) => (
              <SelectorButton
                key={color.name}
                label={color.name}
                color={color.color}
                onClick={() => handleBruise(color)}
                selected={curColor.name}
              />
            ))
          )
        ) : null}

        {curColor.color ? (
          <button
            onClick={() => handleButtonClick()}
            style={{
              backgroundImage: `url(${nextLogo})`,
              backgroundSize: "cover",
              height: "40px",
              width: "40px",
              margin: "4px",
              border: "0px",
            }}
          />
        ) : null}
      </div>
      {ready && (
        <SelectorButton
          label={"Can I eat this mushroom?"}
          color={"black"}
          onClick={() => callResult()}
        />
      )}
      {ready && isLoading && (
        <SelectorButton
          label={"..."}
          color={"black"}
          disabled={true}
          style={{cursor: "auto"}}
        />
      )}
      {result && (
        <>
          <SelectorButton
            label={result === "e" ? "Yes, you can eat" : "No, you can't eat"}
            color={"black"}
            disabled={true}
          />
          <SelectorButton
            label={"< Back to home"}
            color={"black"}
            onClick={() => {
              handleReset();
              setIsStart(true);
            }}
          />
        </>
      )}
    </div>
  );
}

export default App;
