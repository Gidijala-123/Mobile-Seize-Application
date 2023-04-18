$(document).ready(function()
{
// for status > transfer button
    $('.bbb').click(function()
    {
     var aa=$(this).val();
      $.post('/change',{"rno":aa},function(data)
      {
        alert("Mobile returned & Status changed successfully..!");
        location.reload('/home');
      });
    });
  

// to change the status color after clicking on transfer button
    $("td").each(function(){
        if($(this).text()=="Returned"){
            $(this).css("backgroundColor","#FD052E");
            $(this).css("color","white");
        }
        if($(this).text()=="At_office"){
            $(this).css("backgroundColor","#85FD2D");
            $(this).css("color","black"); 
        }
    });
    
// for posting update data on click
	$('.edit').click(function()
    {
    	var a=$(this).val();
    	$.post('/edit',{rno:a},function(data3)
    	{
    		var a=JSON.stringify(data3);
    		var b=JSON.parse(a);
            
    		$('#Date').val(b[0].Date);	
    		$('#Time').val(b[0].Time);
    		$('#rno').val(b[0].rno);    		
    		$('#sname').val(b[0].sname);
    		$('#clg').val(b[0].clg);
    		$('#brch').val(b[0].brch);
    		$('#year').val(b[0].year);
    		$('#sec').val(b[0].sec);
    		$('#spno').val(b[0].spno); 
    		$('#pname').val(b[0].pname);
    		$('#ppno').val(b[0].ppno);
    		$('#mmodel').val(b[0].mmodel);
    		$('#imei').val(b[0].imei);
    		$('#mclr').val(b[0].mclr);
    		$('#rsn').val(b[0].rsn);
    		$('#ename').val(b[0].ename);
    		$('#epno').val(b[0].epno);
    		$('#eid').val(b[0].eid);
    	});
    	$('.dontdisplay').show();
    });  

// to display anchor tag data of help button
   $('#navbar a').click(function(e) 
        {
          $('.dontshow').show();
          $('.conta > div').hide();
          $(this.hash).show();
          e.preventDefault(); //to prevent scrolling
        }); 

// for contact tab
    $('#cntm11').click(function(e)
        {
          $('.main').hide();
          $('#m11').show();
        });

    $('#cntm12').click(function(e)
        {
          $('.main').hide();
          $('#m12').show();
        });
    $('#cntm21').click(function(e)
        {
          $('.main').hide();
          $('#m21').show();
        });
    $('#cntm22').click(function(e)
        {
          $('.main').hide();
          $('#m22').show();
        });
    $('#cntm31').click(function(e)
        {
          $('.main').hide();
          $('#m31').show();
        });
    $('#cntm32').click(function(e)
        {
          $('.main').hide();
          $('#m32').show();
        });
    $('#cntb11').click(function(e)
        {
          $('.main').hide();
          $('#b11').show();
        });
    $('#cntb12').click(function(e)
        {
          $('.main').hide();
          $('#b12').show();
        });
    $('#cntb21').click(function(e)
        {
          $('.main').hide();
          $('#b21').show();
        });
    $('#cntb22').click(function(e)
        {
          $('.main').hide();
          $('#b22').show();
        });
    $('#cntb31').click(function(e)
        {
          $('.main').hide();
          $('#b31').show();
        });
    $('#cntb32').click(function(e)
        {
          $('.main').hide();
          $('#b32').show();
        });
    $('#cnta11').click(function(e)
        {
          $('.main').hide();
          $('#a11').show();
        });
    $('#cnta21').click(function(e)
        {
          $('.main').hide();
          $('#a21').show();
        });
    $('#cnta31').click(function(e)
        {
          $('.main').hide();
          $('#a31').show();
        });

    $('#xyz').click(function(e)
        {
          $('.main').show();
        });
});


     
