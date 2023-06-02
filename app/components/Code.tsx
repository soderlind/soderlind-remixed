import Refractor from "react-refractor";
import javascript from "refractor/lang/javascript";
import typescript from "refractor/lang/typescript";
import php from "refractor/lang/php";
import css from "refractor/lang/css";

Refractor.registerLanguage(javascript);
Refractor.registerLanguage(typescript);
Refractor.registerLanguage(php);
Refractor.registerLanguage(css);

type CodeProps = {
  value: {
    code: string;
    language: string;
    highlightedLines?: number[];
  };
};
export function Code(props: CodeProps) {
  const { code, language, highlightedLines } = props.value;
  return (
    <Refractor
      language={language || "javascript"}
      value={code}
      markers={highlightedLines}
    />
  );
}
