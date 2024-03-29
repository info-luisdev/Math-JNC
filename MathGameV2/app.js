const gameArea = document.querySelector('.game');
const gameOptions = document.querySelector('.gameOptions');
const btn = document.createElement('button');
const btn1 = document.createElement('button');
const output = document.createElement('div');
const message = document.createElement('div');
//update of elements
btn1.style.display = 'none';
btn.classList.add('startBtn');
btn1.classList.add('csvBtn');
output.textContent = "Pulsa el botón para comenzar";
btn.textContent = "Empezar de Nuevo";
output.classList.add('output');
message.classList.add('message');
//adding elements to page
gameArea.append(message);
gameArea.append(output);
gameArea.append(btn);
gameArea.append(btn1);
//game options
const opts = ['*','/','+','-'];
const game = {correct:'',maxValue:10,questions:10,oVals:[0,1,2,3],curQue:0,hiddenVal:3,inplay:false};
const player = {correct:0,incorrect:0,score:[],playerName:'tester'};
// event listeners
btn.addEventListener('click',startGame);
btn1.addEventListener('click',createCSV);

function startGame(){
    btn1.style.display = 'none';
    btn.style.display = 'none'; //hide start button
    gameOptions.style.display = 'none';  //hide to options inputs

    player.score.length = 0;
    player.correct = 0;
    player.incorrect = 0;

    getValues(); //game parameters reset
    buildBoard(); //create game board
}

function buildBoard(){
    output.innerHTML='';
    for(let i=0;i<game.questions;i++){
        const div = document.createElement('div');  //parent question div
        div.classList.add('question');
        div.indexVal = i;
        div.append(document.createTextNode(i+1+'. ')); //add counter
        output.append(div); //add to html page
        buildQuestions(div); //add question
    }
}

function buildQuestions(div){
    let vals = [];
    vals[0] = Math.ceil(Math.random()*(game.maxValue));
    let tempMax = game.maxValue+1; //temporary max value
    game.oVals.sort(()=>{return 0.5 - Math.random()});  //randomize array
    if(game.oVals[0] == 3){
        tempMax = vals[0];  //remove negative numbers
    }
    vals[1] = Math.floor(Math.random()*tempMax ); //random value for second value
    if(game.oVals[0]==0){  //multiply not by zero
        if(vals[1]==0){vals[1]=1;}
        if(vals[0]==0){vals[0]=1;}
    }
    if(game.oVals[0] == 1){ //division none by zero
        if(vals[0]==0){vals[0]=1;}
        let temp = vals[0] * vals[1];
        vals.unshift(temp);  // create vals[2] largest number first
    }else{
        vals[2] = eval(vals[0] + opts[game.oVals[0]] + vals[1]); //set vals[2]
    }
    vals[3] = opts[game.oVals[0]];

    let hiddenVal; 
    if(game.hiddenVal != 3){ //check is hidden is set
        hiddenVal = game.hiddenVal;
    }else{
        hiddenVal = Math.floor(Math.random()*3);
    }

    const answer = document.createElement('input');
    const myBtn = document.createElement('div');
    answer.setAttribute('type','number');
    //answer.setAttribute('max',99999);
    answer.setAttribute('min',0);
    answer.classList.add('boxAnswer');
    answer.addEventListener('keyup',(e)=>{
        if(e.code == 'Enter'){
            checkAnswer();
        }
    })
    function checkAnswer(){
        player.score[div.indexVal][4] =  true;
        answer.disabled = true;
        if(answer.correct == answer.value){
            player.score[div.indexVal][3] =  'correct';
            div.style.backgroundColor = 'green';
            myBtn.style.backgroundColor = 'green';
        }else{
            player.score[div.indexVal][3] =  'wrong';
            div.style.backgroundColor = 'red';
            myBtn.style.backgroundColor = 'red';
        }
        //console.log(player.score[div.indexVal]);
        checkComplete();
        myBtn.textContent = answer.correct;
    }


    function checkComplete(){
        let cnt = 0;
        player.score.forEach((el)=>{
            console.log(el[4]);
            if(el[4]){
                cnt++;
            }
        })
        if(cnt >= game.questions ){
            console.log('Game Over');
            btn.style.display = 'block';
            //btn1.style.display = 'block';
            //btn1.textContent = 'Download Score';
        }
        console.log('Questions Done '+cnt);
    }
    //let tempOutput = vals.join(' ');
    let ansx = [];
    let quex = [];
    for(let i=0;i<3;i++){
        ansx.push(vals[i]);
        if(hiddenVal == i){
            quex.push('_');
            answer.correct = vals[i];
            div.append(answer);
        }else{
            maker1(div,vals[i],'box');
            quex.push(vals[i]);
        }
        if(i==0){
            let tempSign = vals[3] == '*' ? '&times;' : vals[3];
            ansx.push('x');
            quex.push('x'); 
            maker1(div,tempSign ,'boxSign');
        }
        if(i==1){
            ansx.push('=');
            quex.push('='); 
            maker1(div,'=','boxSign');
        }
        if(i==2){
            myBtn.classList.add('myBtn');
            myBtn.textContent = 'check';
            myBtn.addEventListener('click',checkAnswer,{once:true});
            div.append(myBtn);
        }
    }
    quex = quex.join(' ');
    ansx = ansx.join(' ');
    //console.log(quex,ansx);
    player.score.push([div.indexVal,quex ,ansx ,false,false]);
    //console.log(player.score);

}
function maker1(div,v,cla){
    const temp = document.createElement('div');
    temp.classList.add(cla);
    temp.innerHTML = v;
    div.append(temp);
}

function getValues(){
    game.maxValue = Number(document.querySelector('#maxVal').value);
    game.questions = document.querySelector('#numQuestions').value;
    let temp = document.querySelector('#selOpt');
    let tempArr = [];
    for(let i=0;i<temp.options.length;i++){
        if(temp.options[i].selected){
            tempArr.push(i);
        };
    }
    game.oVals = tempArr;
}

function createCSV(){
    let file;
    let holder = [];
    let filename = player.playerName + '.csv';
    let properties = {
        type:"text/csv;charset=utf-8;"
    }
    player.score.forEach((el)=>{
        console.log(el);
        holder += clean(el) + '\n';
    })
    file = new File([holder],filename,properties);
    let link = document.createElement('a');
    let url = window.URL.createObjectURL(file);
    link.setAttribute('href',url);
    link.setAttribute('download',filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function clean(row){
    let rep = '';
    row.forEach((cell,index)=>{
        cell = cell == null ? "" : cell.toString();
        if(cell.search(/("|,|\n)/g) >= 0) cell = '"' + cell + '"';
        if(index > 0 ) rep += ",";
        rep += cell;
    })
    return rep;
}