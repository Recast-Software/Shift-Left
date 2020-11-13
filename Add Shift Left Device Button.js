/*
Add Shift Left Device Button
Updates the incident form to show the Recast Available Device Actions button on the Incident form 
next to the Configuration Item field. If the button already exists on the form, this will NOT add a new one.
*/
try {
	// set pDryRun to true if you want to run it first and log what would happen
	// set pDryRun to false when you are ready to update the dictionary record for the button to show up on the incident form
	var pDryRun = false; 

	var gr = new GlideRecordSecure('sys_dictionary');
	var pTableName = 'task';
	var pColumnName = 'cmdb_ci';
	var pAttribute = 'x_471418_recast_ri_recast_ci';
	var bUpdate = false;
	var updatedAttributes = "";

	gr.addQuery('name',pTableName);
	gr.addQuery('element',pColumnName);
	gr.query();
	if(gr.next()){
		var vAttributes = gr.attributes.toString();
		var nLength;
		if (vAttributes) {
			nLength = vAttributes.length;
		} else {
			nLength = 0;
		}
		if (0 == nLength) {
			// There are no other attributes, just set it as a ref_contribution
			updatedAttributes = "ref_contributions=" + pAttribute;
			bUpdate = true;
		} else {
			// Attributes is not empty, check to see if we have it set already:
			var n = vAttributes.indexOf(pAttribute);
			var nRef = vAttributes.indexOf("ref_contributions=");
			if (-1 == n) {
				// look for refcontributions
				if(nRef == -1) {
					// if it doesn't exists, add it with ref_contributions=
					updatedAttributes = vAttributes + ',ref_contributions=' + pAttribute;
				}
				else { //if it exists, append pAttribute to that
					// split the attributes by comma
					var arrayAttr = vAttributes.split(',');

					// find the attribute with header ref_contributions
					for(var j=0;j<arrayAttr.length;j++){
						var labelAndAttr = arrayAttr[j].split('=');

						if(updatedAttributes.toString().length>0){
							updatedAttributes += ",";}				

						if(labelAndAttr[0]=="ref_contributions")
						{
							updatedAttributes +=  arrayAttr[j] + ";" + pAttribute;
						}
						else{
							updatedAttributes += arrayAttr[j]; 
						}
					}
				}
				bUpdate = true;
			} else {
				// The attribute is set; do nothing
				gs.info("***SHIFT LEFT Add Device Button attribute already exists");
			}
		}
		if (!pDryRun) {
			if (bUpdate) {
				gr.attributes = updatedAttributes;
				gr.setWorkflow(false);
				gr.update();
			}
		}
		bUpdate = false;
	}

}
catch(ex) {

	gs.info("***SHIFT LEFT Add Device Button dictionary reference error: " + ex);
}
