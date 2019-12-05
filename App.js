// Budget App Start
// By Muhammad Adeel
// Date: 4/9/2019

var budgetController = (function (){
    
    let Income = function(id,des,val){
        this.id = id;
        this.description = des;
        this.value = val;
    };

    let Expense = function(id,des,val){
        this.id = id;
        this.description = des;
        this.value = val;
    };

    function calculateTotal(type){
        let sum = 0 ;
        
        data.allItems[type].forEach(function(current){
            sum += current.value;
        });

        data.total[type] = sum;
    }

    let data = {
        allItems:{
            positive : [],
            negative : []
        },
        total : {
            positive: 0,
            negative: 0
        },
        budget : 0,
        percentage : -1
        
    };

    return{
        addItem: function(type , des , val){
            let newItem;
            let ID ;
            
            
            if(data.allItems[type].length > 0){
               ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0 ;
            }


            if(type === "positive"){
                newItem = new Income(ID,des,val);
            }
            else if(type === "negative"){
                newItem = new Expense(ID,des,val);
            }

            data.allItems[type].push(newItem);
            return newItem;
        },
        deleteItem : function(type,id){
            //get only the id from our data structure
           let ids = data.allItems[type].map(function(current){
                return current.id;
            });
            let index = ids.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index,1);// removing an item 
            }

        },

        calculateBudget : function(){

            //total Income && total expense
            calculateTotal("positive");
            calculateTotal("negative");
            //budget
            data.budget = data.total.positive - data.total.negative;
            //percentages
            if(data.total.positive > 0){
                data.percentage = Math.round((data.total.negative / data.total.positive)*100);
            } 
            else{
                data.percentage = -1;
            } 
        },

        getBudget : function(){
            return {
                budget : data.budget,
                positive : data.total.positive,
                negative : data.total.negative,
                percentage : data.percentage
            }
        },

        test : function(){
            console.log(data);
        }
    };

})();


let uiController = (function(){
   let element;

    function numberFormat(value){
        let newSplit, int , des;
        value = Math.abs(value);
        value = value.toFixed(2);
        newSplit = value.split(".")
        int =  newSplit[0];
        if(newSplit[0] > 0){
            int = int.substr(0,int.length-3) + "," + int.substr(int.length-3,3) ;
        }
        des = newSplit[1];
        return int + "."+ des;

    }

    return {
        //current dataMonth

        currentMonth : function(){
            let now,year,month,allMonths ;
            now = new Date();
            year=now.getFullYear();
            month = now.getMonth();
            allMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];
            
            document.querySelector(".bYear").textContent = year;
            document.querySelector(".bMonth").textContent = allMonths[month];
        },

        //get input data
        getData : function(){
            return{
                type : document.querySelector(".sel").value, //positive or negative string
                description : document.querySelector(".des").value,
                value : parseFloat(document.querySelector(".val").value)
            }

        },
        ListFOrItems : function(obj , type){
            let html;
            let newHtml;
            if(type === "positive"){
                element = ".incomeList";
                html =   `<div class="item" id="positive-%id%">
                                <div class="itemDes">%des%</div>
                                <div class="itemVal">+%val%</div>
                                <div class="deleteItem">
                                    <button>DELETE</button>
                                </div>
                            </div>`
            }
          else if(type === "negative"){
                  element = ".expenseList";
                     html = `  <div class="item" id="negative-%id%">
                                    <div class="itemDes">%des%</div>
                                    <div class="itemVal">-%val%</div>
                                    <div class="deleteItem">
                                        <button>DELETE</button>
                                    </div>
                                </div> `
            }
            
            newHtml = html.replace("%id%",obj.id);
            newHtml = newHtml.replace("%des%",obj.description);
            newHtml = newHtml.replace("%val%", numberFormat(obj.value));
            document.querySelector(element).insertAdjacentHTML("beforeend",newHtml);
        },


        deleteListItem : function(selectorId){
            el = document.getElementById(selectorId); 
            el.parentNode.removeChild(el);

        },

        clearField : function(){
            let clearList, clearArray;
            clearList = document.querySelectorAll(".des" +", "+ ".val"); // return list so we have to convert it to an array
            console.log(clearList);
            clearArray = Array.prototype.slice.call(clearList);
            console.log(clearArray);
            clearArray.forEach(function(c){
                c.value = "";
            });
            
           clearArray[0].focus();


        },

        displayBudget : function(obj){
           if(obj.budget > 0 ){
            document.querySelector(".totalBudget").textContent = "+ "+numberFormat(obj.budget);
           } else{
            document.querySelector(".totalBudget").textContent = "- "+numberFormat(obj.budget);
           }
           
           document.querySelector(".totalIncome").textContent = "+ "+ numberFormat(obj.positive);
           document.querySelector(".totalExpense").textContent = "- " +numberFormat(obj.negative);
           if(obj.percentage > 0 ){
            document.querySelector(".per").textContent = obj.percentage+ "%";
           }

        }

        

        // incomeList : function(){
        //     return incomeList;
        // }
    }

})();


let controller = (function(budgetCon,uiCon){
    let setUpEventListener = function(){
          //AddButton Event
          document.querySelector(".addButton").addEventListener("click",AddControl);
          //keypress event
          document.addEventListener("keypress",function(event){
          if(event.keyCode === 13){
           AddControl();
          }
          
        });
        document.querySelector(".sec3").addEventListener("click",controlDeleteItem);
        document.querySelector(".sel").addEventListener("change", uiCon.changeType);
    
    };

    function updateBudget(){
        let budget;
        budgetCon.calculateBudget();
        budget = budgetCon.getBudget();
        uiCon.displayBudget(budget);
    }

    //AddData function
    function AddControl(){
      let newItem;  
      let inputData = uiCon.getData();
      let getB = budgetCon.getBudget();
      //checking input fields 
      if(inputData.description !== "" && !isNaN(inputData.value) && inputData.value > 0){

        newItem = budgetCon.addItem(inputData.type,inputData.description,inputData.value);
      
        //displayList
        uiCon.ListFOrItems(newItem,inputData.type);
        //clear Fields
        uiCon.clearField();
      
        updateBudget();

      }
      
      console.log("submited");  
      
    }

    //delete Items
    function controlDeleteItem(event){
        let splitId , type , id;
        let itemId =  event.target.parentNode.parentNode.id;
        
        if(itemId){
            splitId = itemId.split("-");
            type = splitId[0];
            id = parseInt(splitId[1]);
            //delete from dataStructure
            budgetCon.deleteItem(type,id);
            //delete from User InterFace
            uiCon.deleteListItem(itemId);
            //update
            updateBudget();
        }
    }

    return{
        inti : function(){
            console.log("Application Has Started");
            //display Curretn Month and Year
            uiCon.currentMonth();
            uiCon.displayBudget({
                budget : 0,
                positive: 0,
                negative : 0,
                percentage: -1
            });
            setUpEventListener();
        }
    }
   
})(budgetController,uiController);

controller.inti();