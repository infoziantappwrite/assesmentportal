import React, { useState } from "react";
import { Copy, FileDown, FileText } from "lucide-react";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { Document, Packer, Paragraph, TextRun } from "docx";

pdfMake.vfs = pdfFonts?.pdfMake?.vfs || pdfFonts?.vfs;

// 🔹 Single QA item styled manually
function QAItem({ ans, index }) {
  const question = ans.question_id;
  const isCoding = ans.question_type === "coding";

  const getCopyText = () => {
    let copyText = `Q${index + 1}. ${question?.content?.question_text}\n\n`;
    if (isCoding) {
      copyText += `Language: ${ans.programming_language?.toUpperCase() || "N/A"}\n\n`;
      copyText += ans.code_solution || "No code submitted.";
    } else {
      copyText += "Answer:\n";
      if (Array.isArray(ans.selected_options)) {
        const selectedOptions = question?.options.filter(opt =>
          ans.selected_options.includes(opt.option_id)
        );
        copyText += selectedOptions.map(opt => `- ${opt.text}`).join("\n") || "No option selected.";
      }
    }
    return copyText;
  };

  const handleCopy = () => navigator.clipboard.writeText(getCopyText());

  return (
    <div style={qaItemStyle}>
      <div style={qaHeaderStyle}>
        <h4 style={qaTitleStyle}>Q{index + 1}. {question?.content?.question_text}</h4>
        <button onClick={handleCopy} style={btnSmallStyle}><Copy size={14} /> Copy</button>
      </div>

      <p style={marksStyle}>
        Marks: {ans.evaluation?.marks_obtained ?? 0}/{ans.evaluation?.total_marks ?? question?.marks ?? 0}
      </p>
      <span style={{ ...statusStyle, backgroundColor: ans.evaluation?.is_correct ? "#dcfce7" : "#fee2e2", color: ans.evaluation?.is_correct ? "#166534" : "#991b1b" }}>
        {ans.evaluation?.is_correct ? "Correct" : "Incorrect"}
      </span>

      {isCoding ? (
        <pre style={codeBlockStyle}>
          {`Language: ${ans.programming_language?.toUpperCase() || "N/A"}\n\n`}
          {ans.code_solution || "No code submitted."}
        </pre>
      ) : (
        <ul style={{ paddingLeft: 20, marginTop: 10 }}>
          {question?.options.map(opt => {
            const isSelected = ans.selected_options?.includes(opt.option_id);
            const isCorrect = opt.is_correct;

            let bgColor = "#fff";
            let textColor = "#374151";
            let label = null;

            if (isCorrect && isSelected) { bgColor="#dcfce7"; textColor="#166534"; label="Correct & Selected"; }
            else if (isCorrect) { bgColor="#dcfce7"; textColor="#166534"; label="Correct"; }
            else if (isSelected) { bgColor="#fee2e2"; textColor="#991b1b"; label="Your Answer"; }

            return (
              <li key={opt.option_id} style={{ padding: 8, borderRadius: 6, border: "1px solid #d1d5db", backgroundColor: bgColor, color: textColor, marginBottom: 6, display:"flex", justifyContent:"space-between" }}>
                <span>{opt.text}</span>
                {label && <span style={{ fontSize: 12, fontWeight: 500 }}>{label}</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// 🔹 Main submission export
export default function SubmissionQAExport({ submission }) {
  const [copied, setCopied] = useState(false);

  const getAllCopyText = () => {
    if (!Array.isArray(submission?.answers)) return "";
    return submission.answers.map((ans, index) => {
      const question = ans.question_id;
      let text = `Q${index + 1}. ${question?.content?.question_text}\n\n`;
      if (ans.question_type === "coding") {
        text += `Language: ${ans.programming_language?.toUpperCase() || "N/A"}\n\n`;
        text += ans.code_solution || "No code submitted.";
      } else {
        text += "Answer:\n";
        if (Array.isArray(ans.selected_options)) {
          const selectedOptions = question?.options.filter(opt =>
            ans.selected_options.includes(opt.option_id)
          );
          text += selectedOptions.map(opt => `- ${opt.text}`).join("\n") || "No option selected.";
        }
      }
      return text;
    }).join("\n\n----------------------\n\n");
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(getAllCopyText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ✅ PDF download keeping UI-like structure
  const handleDownloadPDF = () => {
  const body = [];

  submission.answers.forEach((ans, index) => {
    const questionText = `Q${index + 1}. ${ans.question_id?.content?.question_text}`;
    body.push({ text: questionText, bold: true, fontSize: 12, margin: [0, 5, 0, 5] });

    if (ans.question_type === "coding") {
      const code = `Language: ${ans.programming_language?.toUpperCase() || "N/A"}\n\n${ans.code_solution || "No code submitted."}`;
      body.push({ text: code, fontSize: 10, margin: [0, 0, 0, 5], style: "code", color: "#1f2937" });
    } else {
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      ans.question_id?.options.forEach((opt, i) => {
        const isSelected = ans.selected_options?.includes(opt.option_id);
        const isCorrect = opt.is_correct;

        let bgColor = "#ffffff";
        let textColor = "#111827";
        let label = "";

        if (isCorrect && isSelected) { bgColor = "#dcfce7"; textColor = "#166534"; label="Correct & Selected"; }
        else if (isCorrect) { bgColor = "#dcfce7"; textColor = "#166534"; label="Correct"; }
        else if (isSelected) { bgColor = "#fee2e2"; textColor = "#991b1b"; label="Your Answer"; }

        body.push({
          text: `${letters[i]}. ${opt.text} ${label ? `(${label})` : ""}`,
          margin: [0, 2, 0, 2],
          color: textColor,
          fillColor: bgColor,
          fontSize: 11,
        });
      });
    }

    body.push({ text: " ", margin: [0, 5, 0, 5] });
    body.push({ canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: "#d1d5db" }] });
    body.push({ text: " ", margin: [0, 2, 0, 2] });
  });

  const docDefinition = {
    content: body,
    defaultStyle: { fontSize: 11, color: "#222222" },
    styles: {
      code: { font: "Courier", color: "#1f2937" },
    },
    pageMargins: [40, 40, 40, 40],
  };

  pdfMake.createPdf(docDefinition).download("submission_answers.pdf");
};



  // ✅ Word download
  const handleDownloadWord = async () => {
    const text = getAllCopyText();
    const doc = new Document({
      sections: [{ children: text.split("\n").map(line => new Paragraph({ children: [new TextRun(line)] })) }]
    });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "submission_answers.docx";
    link.click();
  };

  return (
    <div style={{ maxWidth: 1300, margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 8, padding: 20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight:"bold", color:"#333" }}>Submitted Answers</h2>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={handleCopyAll} style={btnStyle}><Copy size={16} /> Copy All</button>
            <button onClick={handleDownloadPDF} style={btnStyle}><FileDown size={16} /> PDF</button>
            <button onClick={handleDownloadWord} style={btnStyle}><FileText size={16} /> Word</button>
          </div>
        </div>

        {submission?.answers?.map((ans,index)=> <QAItem key={ans._id} ans={ans} index={index} />)}
      </div>

      {copied && (
        <div style={{ position:"fixed", top:20, right:20, background:"#d1fae5", color:"#065f46", padding:"10px 15px", borderRadius:6 }}>
          ✅ Copied!
        </div>
      )}
    </div>
  );
}

// 🔹 Styles
const qaItemStyle = { border: "1px solid #d1d5db", borderRadius: 8, padding: 16, marginBottom: 16, background:"#fff" };
const qaHeaderStyle = { display:"flex", justifyContent:"space-between", alignItems:"start", marginBottom: 6 };
const qaTitleStyle = { fontWeight:600, color:"#4f46e5" };
const marksStyle = { fontSize:12, color:"#6b7280", fontStyle:"italic", marginTop:4 };
const statusStyle = { display:"inline-block", fontSize:12, padding:"2px 6px", borderRadius:4, fontWeight:500, marginTop:4 };
const codeBlockStyle = { background:"#f8f8f8", border:"1px solid #ddd", borderRadius:4, padding:10, overflowX:"auto", fontSize:13, fontFamily:"monospace", marginTop:10 };
const btnStyle = { display:"flex", alignItems:"center", background:"#f3f4f6", border:"1px solid #ccc", borderRadius:4, padding:"5px 10px", cursor:"pointer", fontSize:14, gap:5 };
const btnSmallStyle = { display:"flex", alignItems:"center", background:"#f3f4f6", border:"1px solid #ccc", borderRadius:4, padding:"3px 8px", cursor:"pointer", fontSize:12, gap:4 };
