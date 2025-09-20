import React from "react";
import { Text as RNText } from "react-native";

// Safe Text component that handles undefined/null values
const SafeText = ({ children, ...props }) => {
  // Handle undefined, null, or non-string values
  const safeChildren = React.Children.map(children, (child) => {
    if (child === null || child === undefined) {
      return "";
    }
    if (typeof child === "string" || typeof child === "number") {
      return child;
    }
    if (React.isValidElement(child)) {
      return child;
    }
    return String(child);
  });

  return <RNText {...props}>{safeChildren}</RNText>;
};

export default SafeText;
