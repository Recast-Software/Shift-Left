/*
Runs agaist sys_user table. If source field is populated from LDAP and includes domain information
parses the source field to get the domain parts using "DC" label, concantenates them together and put them in the domain field
*/
var userdomain;
var gr = new GlideRecord('sys_user');
gr.query();
while (gr.next()) { 
	source = gr.source;

	if(source){
		// parse source to create domain
		var DCs = source.toString().split(',');
		var domain = "";
		
		for(i=0;i<DCs.length;i++){
			var DCpart = DCs[i].toString().split('=');
			if(DCpart[0]=="DC") {
				domain += DCpart[1];
				if(i<DCs.length-1)
					domain+= ".";
				}
		}
		gr.sys_domain= domain;
		gr.update();
	}
}

