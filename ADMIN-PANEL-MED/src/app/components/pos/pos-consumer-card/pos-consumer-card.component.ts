import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-pos-consumer-card',
  templateUrl: './pos-consumer-card.component.html',
  styleUrls: ['./pos-consumer-card.component.scss']
})
export class PosConsumerCardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $(document).ready(function(){
      //take html tags with assigned values and set to variable.
      //set textarea to the value of "blank", and add to values.
      
       $('#1,#2,#3,#4,#5,#6,#7,#8,#9,#0,#add, #subtract, #multiply, #divide, #power, #dot, #para1, #para2').click(function(){

        var v = $(this).val();
        var p = $('#input_box').val() ;
        var total = $('#input_box').val(p.toString() + v.toString()); 
        });
      
      //clicking equal sign evaluates the textarea
      $('#equal').click(function(){
        var p = $('#input_box').val() ;
        $('#input_box').val(eval(p.toString()));
        });
    
      
      $('#clear').click(function(){
          $('#input_box').val('');
        });
      

        // $('#backspace').click(function(){
        //   var v = ( $('input_box').val() ).toString;
        //   var length = parseInt(v.length)
        //   var substr = v.substring(1,  length);
        // });
        
     
    });
  }

}
