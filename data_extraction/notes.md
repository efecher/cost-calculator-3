# NOTES

## Current Logic Expressions for Questions

### Student Age
Always show question

### Planned Residence
Always show question

### Current Residence
Always show question

### Highschool/Transfer
Show if Student Age <= 24, assume "transfer" if user is older than 24 years of age, i.e., not a Dependent. Transfers and non-Dependents will only have values calculated based on GPA, only Freshmen will have the "test-optional" choice.

### Current GPA
Always show question, this value applies in all scenarios, especially Merit where the first range is GPA and the second could be either SAT or ACT *unless* user selects "Test Optional" in which case, there is a different matrix that is used for lookup that only uses a range of GPAs to determine the value.

### Use Test Scores, Which Test, Test Score
Only relevant with Freshmen, transfer/non-Dependent students would not be presented this option as their eligible values are determined by GPA instead of test scores.

### Marital Status
Only relevant if the user is non-Dependent. This would be to determine if the user is then Independent-With-No-Dependents or Independent-With-Dependents  

### Children  
Same as Marital Status, only relevant if user is a non-Dependent to determine if the user has dependents

### People-in-Household  
Determine how many are in the user's household, including themself.   

### Number-in-College  
The user + any other family members currently enrolled in college attempting their first degree.  

### Household Income  
Range of income for the *entire household*, user included. Include work income for student, and any child support they receive if they are Independent. If they are a Dependent, include only the income for the parent(s) they live with if parents are divorced or separated. If they parent the user lives with currently is remarried, include **both** biological parent *and* their spouse's income. 

---

"High School or Transfer" - only show if age is < 24  
