<cfscript>
// NOTE: routine to read in XLSX spreadsheet from Admissions, 
// extracts the data and formats it into JSON needed for the 
// Cost Calculator


param name="url.table", type="boolean", default=false;


XLSX_PATH = expandPath('\_cs_apps\spreadsheet\shucost.xlsx');
outputFilename = 'efc.json';
filePath = '/cust/webroot/site8/_cs_apps/spreadsheet/' & outputFilename;
fileStatus = {};

FULL_EFC_JSON = '{"efcDependent":' & extractEFCTable(XLSX_PATH, 2, url.table) & ', "efcNotDependentButHasDependent":' & extractEFCTable(XLSX_PATH, 3, url.table) & ', "efcNotDependentAndNoDependent":' & extractEFCTable(XLSX_PATH, 4, url.table) & ' }';

try {
  fileStatus = application.adf.csData.CSFile(
    action='write',
    destination=filePath,
    file=filePath,
    output=FULL_EFC_JSON
  );
} catch (any e) {
  writeDump(var=e, expand="false", label="ERROR!");
}

writeOutput(FULL_EFC_JSON);



// NOTE: this is based on the most recent version of the spreadsheet obtained from Admissions, if the format changes,
// this will need to be updated accordingly to extract the correct values and format the output JSON properly
private string function extractEFCTable(required string filePath, required numeric sheetNumber, boolean showTable) {
  cfspreadsheet(
    action="read",
    src=filePath,
    query="shudata",
    sheet=sheetNumber
  );

  outputArray = arrayNew(1);

  // NOTE: start at row 3 where the data is, find how many rows we have of actual data, not comments or descriptive blurbs

  outputJSON = '';

  one_in_college = arrayNew(1);
  two_in_college = arrayNew(1);
  three_in_college = arrayNew(1);


  for(row in shudata) {
    // NOTE: collect data for the row
    if(isNumeric(row.col_1)) {
      rowStruct = structNew();
      rowStruct['numberInCollege'] = row.col_1;
      rowStruct['numberInFamily'] = row.col_2;
      rowStruct['incomeRanges'] = [row.col_3, row.col_4, row.col_5, row.col_6, row.col_7,row.col_8, row.col_9, row.col_10, row.col_11];

      // NOTE: determine which 'bucket' it goes in by the number in college
      switch(rowStruct['numberInCollege']) {
        case 2: arrayAppend(two_in_college, rowStruct);
                break;
        case 3: arrayAppend(three_in_college, rowStruct);
                break;
        default: arrayAppend(one_in_college, rowStruct);
                break;
      }
    }
  }

  arrayAppend(outputArray, one_in_college);
  arrayAppend(outputArray, two_in_college);
  arrayAppend(outputArray, three_in_college);

  outputJSON = outputJSON & serializeJSON(outputArray);

  return outputJSON;
}
</cfscript>