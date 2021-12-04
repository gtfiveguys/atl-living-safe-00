import Papa from "papaparse";

export default async function readCSV(pathFile, header = false) {
  const response = await fetch(pathFile);
  const reader = response.body.getReader();
  const result = await reader.read();
  const decoder = new TextDecoder("utf-8");
  const csv = decoder.decode(result.value);
  const { data, errors } = Papa.parse(csv, { header: header, skipEmptyLines: true });
  if (errors.length > 0) {
    console.error(errors);
  } else {
    return data;
  }
}
