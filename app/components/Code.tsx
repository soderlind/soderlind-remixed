import React from "react";
import Refractor from "react-refractor";
import js from "refractor/lang/javascript";
import typescript from "refractor/lang/typescript";
import php from "refractor/lang/php";

Refractor.registerLanguage(js);
Refractor.registerLanguage(typescript);
Refractor.registerLanguage(php);

type CodeProps = {
  value: {
    code: string;
    language: string;
    highlightedLines?: number[];
  };
};
export function Code(props: CodeProps) {
  const { code, language, highlightedLines } = props.value;
  return <Refractor language={language || "javascript"} value={code} markers={highlightedLines} />;
}
