$(document).ready(function(){
	$('.pdf').click(function(){

		var doc = new jsPDF();
	    doc.addImage(img, 'jpeg', 0, 0, 210, 297);
          
	    
       // var gid = $('#gid2').val();
        var date = $('#dat2').val();
        var time = $('#tim2').val();

	    var sname=$('#snm2').val();
        var rno = $('#rno2').val();
        var clg = $('#clg2').val();
        var spno = $('#spn2').val();

        var brch = $('#brc2').val();
        var year = $('#yr2').val();
        var sec = $('#sec2').val();

        var pname = $('#pnm2').val();
        var ppno = $('#ppn2').val();

	    var ename=$('#enm2').val();
        var eid = $('#eid2').val();
        var epno = $('#epn2').val();

        var mmodel = $('#mdl2').val();
        var mclr = $('#mcl2').val();
        var imei = $('#ime2').val();
        var rsn = $('#rsn2').val();

        doc.setTextColor("black");
        doc.setFontSize(9);
        doc.setFontType("bold");
	    
	    //1st form
	    //doc.text(gid,38,27);
	    doc.text(date,123,24.5);
	    doc.text(time,163.3,24.5);
	    
	    doc.text(sname, 41.5, 37.5);
	    doc.text(rno, 41.5, 46.4);
	    doc.text(clg, 41.5, 55.5);
	    doc.text(spno, 41.5, 64.3);

	    doc.text(brch, 129.5, 37.5);
	    doc.text(year, 129.5, 46.8);
	    doc.text(sec, 129.5, 55.5);

	    doc.text(pname, 41, 79.4);
	    doc.text(ppno, 41, 88.5);

	    doc.text(ename, 138,79.4);
	    doc.text(eid, 138, 88.5);
	    doc.text(epno, 138, 97.6);
	    
	    doc.text(mmodel, 41, 114.15);
	    doc.text(mclr, 98, 114.15);
	    doc.text(imei, 148, 114.15);
	    doc.text(rsn, 47.5, 123.1);
	    
	    //2nd form
	    doc.text(date,123,171.3);
	    doc.text(time,163.3,171.3);
	    
	    doc.text(sname, 41.5, 184.8);
	    doc.text(rno, 41.5, 193.7);
	    doc.text(clg, 41.5, 203);
	    doc.text(spno, 41.5, 211.6);

	    doc.text(brch, 130.5,184.8);
	    doc.text(year, 130.5, 194.1);
	    doc.text(sec, 130.5, 202.8);

	    doc.text(pname, 41, 227.5);
	    doc.text(ppno, 41, 236.8);

	    doc.text(ename, 138,227);
	    doc.text(eid, 138, 236.7);
	    doc.text(epno, 138, 245.8);
	    
	    doc.text(mmodel, 41, 263.10);
	    doc.text(mclr, 98, 263.45);
	    doc.text(imei, 148, 263.3);
	    doc.text(rsn, 47.5, 272.1);

	    doc.save('#sname'.pdf);
		doc.setFontSize(2);
	})
})