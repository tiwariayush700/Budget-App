//1st module
var budgetController = (function() {


    //function constructor for creating separate income object
    function Income(ID, description, value) {
        this.ID = ID;
        this.description = description;
        this.value = value;
    }

    //function constructor for creating separate income object
    function Expense(ID, description, value) {
        this.ID = ID;
        this.description = description;
        this.value = value;
    }

    //data structure to store income and expenses
    var data = {

        allItems: {
            inc: [],
            exp: []
        },
        total: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1
    };

    let calcTotal = function(type) {
        let sum = 0;
        data.allItems[type].
        forEach(function(element) {
            sum = sum + element.value;
        });
        data.total[type] = sum;
        
    }
    let calcBudget = function() {
        data.budget = data.total['inc'] - data.total['exp'];
        if(data.total['inc'] > 0){
            data.percentage = Math.round((data.total['exp']/data.total['inc'])*100);
        } else {
            data.percentage = '---';
        }
        
    }
    

    return {

        //function to push items to the above ds
        addItem: function(type, des, val) {

            let newItem, ID;
            if(data.allItems[type].length > 0)
                ID = data.allItems[type][data.allItems[type].length-1].ID+1;    //giving a sequential id
            else 
                ID = 0;
            if(type === 'inc') {
                newItem = new Income(ID,des,val);
            }
            else if(type === 'exp') {
                newItem = new Expense(ID,des,val);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },

        test: function() {
            console.log(data);
        },
        
        getData: function(type) {
            
            calcTotal('inc');
            calcTotal('exp');
            calcBudget();
            return {

                totalIncome: data.total['inc'],
                totalExpense: data.total['exp'],
                totalBudget: data.budget,
                totalPercentage: data.percentage

            }
        },
        deleteFromData : function(type, id) {
            let idArr, index;
            // 0 1 5 6 8 9 
            //5
            idArr = data.allItems[type].map(function(element) {
                return element.ID;
            });
            idArr.forEach(function(e,i) {
                if(e === id)
                    index = i;
            });
            data.allItems[type].splice(index, 1);
        }
    }

})();

//2nd module
var UIController = (function() {

    DomNames = {
        selectButton : '.add__btn',
        addType: '.add__type',
        addDescription: '.add__description',
        addValue: '.add__value',
        addIncomeList: '.income__list',
        addExpenseList: '.expenses__list',
        budgetValue: '.budget__value',
        budgetIncomeValue: '.budget__income--value',
        budgetExpenseValue: '.budget__expenses--value',
        budgetExpensePercentage: '.budget__expenses--percentage',
        container: '.container'
    };

    
    

    

        return {
            getInput : function() {
                return {
                    add : document.querySelector(DomNames.addType).value,
                    desc : document.querySelector(DomNames.addDescription).value,
                    val : parseFloat(document.querySelector(DomNames.addValue).value)
                };
            },
            addItemUI: function(obj, type) {
        
                let html, newHtml, element;

                if(type === 'inc') {
                    html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                    newHtml = html.replace('%id%', obj.ID);
                    newHtml = newHtml.replace('%description%', obj.description);
                    newHtml = newHtml.replace('%value%', obj.value);
                    element = DomNames.addIncomeList;
                } else if(type === 'exp') {
                    html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                    newHtml = html.replace('%id%', obj.ID);
                    newHtml = newHtml.replace('%description%', obj.description);
                    newHtml = newHtml.replace('%value%', obj.value);
                    element = DomNames.addExpenseList;
                }

                document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
                

        
        
        
            },
        
        inputNames: function() {
            return DomNames;
        },
        
        displayData: function(obj) {

            document.querySelector(DomNames.budgetValue).textContent = obj.totalBudget;
            document.querySelector(DomNames.budgetIncomeValue).textContent = obj.totalIncome;
            document.querySelector(DomNames.budgetExpenseValue).textContent = obj.totalExpense;
            document.querySelector(DomNames.budgetExpensePercentage).textContent = obj.totalPercentage + '%';
        },
        deleteDataUI: function(selectId) {
            let select;
            select = document.getElementById(selectId);
            select.parentNode.removeChild(select);
        }
    };



})();

//controller module which controls both the modules
var controller = (function(bdgtCtrl, UICtrl) {

    let DOM = UICtrl.inputNames();

    
    
    let inputData = function() {
        let newItem;
        let inputValues = UICtrl.getInput();  
        if(inputValues.desc !== "" && !isNaN(inputValues.val) && inputValues.val > 0) {
           // console.log(inputValues.add);               
            newItem = bdgtCtrl.addItem(inputValues.add, inputValues.desc, inputValues.val);
            console.log(newItem);
            bdgtCtrl.test();
            UICtrl.addItemUI(newItem, inputValues.add);
            let budget = bdgtCtrl.getData();
            UICtrl.displayData(budget);
            console.log(budget.totalIncome);
        } 
    };
    let deleteItem = function(event) {
        let arr, type, id;
        arr = (event.target.parentNode.parentNode.parentNode.parentNode.id).split('-');
        type = arr[0];
        id = parseInt(arr[1]);
        bdgtCtrl.deleteFromData(type,id);
        UICtrl.deleteDataUI(event.target.parentNode.parentNode.parentNode.parentNode.id);
        let budget = bdgtCtrl.getData();
        UICtrl.displayData(budget);
 
    }
    document.querySelector(DOM.selectButton).addEventListener('click', inputData);
    document.querySelector(DOM.container).addEventListener('click', deleteItem);
    document.addEventListener('keypress',function(e) {
        if(e.keyCode === 13 || e.which === 13)
            inputData();
    });

})(budgetController,UIController);