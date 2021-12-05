import React, { useState, useEffect, useCallback, useRef } from "react";
import { VariableSizeList as List } from "react-window";
import "./Recommendations.css";

const listHeightOffset = 200;
const numCharPerLine = 22;

const markerIcons = {
  default: "https://i.loli.net/2021/12/01/VrQvHOwiFLx5Yha.png",
  top: "https://i.loli.net/2021/12/02/j2v6JwaL5GkpEVB.png",
};

// Helper function to break down a string into separate lines
const parseLines = (string) => {
  const words = string.split(" ");
  let lines = [];
  let currCharCount = 0;
  let currLine = [];
  for (var i = 0; i < words.length; i++) {
    if (
      currCharCount + currLine.length - 1 + words[i].length >
      numCharPerLine
    ) {
      lines.push(currLine.join(" "));
      currCharCount = 0;
      currLine = [];
    }
    currCharCount += words[i].length;
    currLine.push(words[i]);
  }
  lines.push(currLine.join(" "));
  return lines;
};

// Helper function to update marker icon
const setMarkerIcon = (items, icon) => {
  items.forEach((item) => item.apartment.marker.setIcon(icon));
};

function Recommendations(props) {
  const { apartments, handleSelectApartment, selectedPlaceTypes } = props;

  const myRef = useRef(null);
  const [rankItems, setRankItems] = useState(null);
  const [rowHeights, setRowHeights] = useState([]);
  const [listHeight, setListHeight] = useState(
    window.innerHeight - listHeightOffset
  );

  // When component is mounted, add event listener to track window resize and update list height
  useEffect(() => {
    window.addEventListener("resize", () => {
      console.log("resize");
      setListHeight(window.innerHeight - listHeightOffset);
    });
  }, []);

  // When user selects/unselects a new type of place, update ranked list
  useEffect(() => {
    if (apartments.current) {
      // If rankItems exist, set marker icon back to default
      if (rankItems) {
        setMarkerIcon(rankItems, markerIcons.default);
      }

      const listItems = [];
      apartments.current.forEach((apt, i) => {
        let isNone = false;
        let totalScore = apt.apt_score;
        selectedPlaceTypes.forEach((type) => {
          if (apt[type.value + "_coordinates"] === "None") {
            isNone = true;
            return;
          }
          totalScore += apt[type.value + "_score"];
        });
        if (isNone) {
          return;
        }
        const lines = parseLines(apt.apt_name);
        listItems.push({
          totalScore: totalScore,
          apartment_lines: lines,
          apartment: apt,
          rowHeight: 12 + lines.length * 27,
        });
      });
      const top50 = listItems
        .sort((a, b) => a.totalScore - b.totalScore)
        .slice(0, 50);

      // Update top 50 markers to new icon
      setMarkerIcon(top50, markerIcons.top);

      setRowHeights([...top50.map((item) => item.rowHeight)]);
      setRankItems(top50);
      if (myRef.current) {
        // console.log(myRef)
        myRef.current.resetAfterIndex(0, true);
      }
    }
  }, [apartments.current, selectedPlaceTypes]);

  // Return the row height of each item
  //const getItemSize = useCallback((index) => rowHeights[index], [rowHeights]);
  const getItemSize = (index) => rowHeights[index];

  // Helper function to render a single row in the scrollable list
  const Row = ({ index, style }) => {
    const { totalScore, apartment_lines, apartment } = rankItems[index];
    return (
      <div className={index % 2 ? "ListItemOdd" : "ListItemEven"} style={style}>
        <p className="apt-ranking">{index + 1}</p>
        <div
          className="apt-name"
          onClick={() => handleSelectApartment(apartment)}
        >
          {apartment_lines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        <p className="apt-score">{totalScore.toFixed(2)}</p>
      </div>
    );
  };

  return (
    <div id="recommendations">
      {rankItems && (
        <List
          className="List"
          height={listHeight}
          itemCount={50}
          itemSize={getItemSize}
          ref={myRef}
        >
          {Row}
        </List>
      )}
    </div>
  );
}

export default Recommendations;
