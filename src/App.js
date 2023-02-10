import './App.css';
import React, { useState, useEffect, useRef } from 'react';

import {SampleData} from './sample-data'

const PlotSymbols = () => {



    const [ symbolList, setSymbolList ] = useState(SampleData);
    const [ show, setShow ] = useState(false);
    const [ posX, setPosX ] = useState(null);
    const [ posY, setPosY ] = useState(null);
    const [ modalX, setModalX ] = useState(null);
    const [ modalY, setModalY ] = useState(null);
    const [ activeSymbolId, setActiveSymbolId ] = useState(null);
    const [modal, setModal] = useState("new")
    const [modalMessage, setModalMessage] = useState("")

    const [ posXFirst, setPosXFirst ] = useState(null);
    const [ posYFirst, setPosYFirst ] = useState(null);

    const latestList = useRef(null);
    latestList.current = symbolList;

    useEffect(()=>{

    }, [])

    const HandleClickOnSvgContainer = (e) => {
      // console.log(x,y)
      // console.log("HandleClickOnSvgContainer");
      var container = document.getElementById("MainSvg")

      // console.log("----------------> " + e.target.getAttribute('id'))
      // if(e.target.getAttribute('id') == "MainSvg")
      // {
      //   console.log("jaaaa")
      // }

      var pt = container.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      pt = pt.matrixTransform(container.getScreenCTM().inverse());

      const id = e.target.id.toString();
      const svgX = Math.round(pt.x);
      const svgY = Math.round(pt.y);
      setPosX(svgX)
      setPosY(svgY)
      const stringToReturn = ` el_Id: ${id}, clientX: ${Math.round(e.clientX)}, clientY: ${Math.round(e.clientY)}, svgX: ${svgX}, svgY: ${svgY}`;
      // console.log(stringToReturn);

      if(e.clientX == posXFirst && e.clientY == posYFirst && e.target.getAttribute('id') == "MainSvg")
      {

        var x = e.clientX;
        var y = e.clientY;

        if(x > 150 && x < window.innerWidth - 150) setModalX(x);
        else if(x > window.innerWidth - 150) setModalX(window.innerWidth - 150);
        else setModalX(150);

        if(y > 150 && y < window.innerHeight - 150) setModalY(y);
        else if(y > window.innerHeight - 150) setModalY(window.innerHeight - 150);
        else setModalY(150);



        setShow(true);
        setModal("new");
      }
      if(e.clientX != posXFirst || e.clientY != posYFirst)
      {
        setActiveSymbolId(null)
      }

    }


    const AddSymbol =()=>{
        const updatedList = [...latestList.current];
        updatedList.push(GetNewSymbol());
        setSymbolList(updatedList);
        setModalMessage("")
    }


    const GetNewSymbol = () => {
        const updatedList = [...latestList.current];
        const MaxId = updatedList.reduce((max, item) => Math.max(max, item.Id), 0)+1;
        const symbol = {
            Id: MaxId,
            type:"node",
            posX: posX-80,
            posY: posY-40,
            parentId:"MainSvg",
            childs:[],
            text:modalMessage,
          };
          return symbol;
    }

    const GetChild = () => {
      const updatedList = [...latestList.current];
      const MaxId = updatedList.reduce((max, item) => Math.max(max, item.Id), 0)+1;
      const activeSymbol = updatedList.find(obj => obj.Id === activeSymbolId);
      const symbol = {
          Id: MaxId,
          type:"node",
          parentId:activeSymbol.Id,
          childs:[],
          posX: activeSymbol.posX,
          posY: activeSymbol.posY+100,
          text:modalMessage,
        };

        updatedList[updatedList.indexOf(activeSymbol)].childs.push(MaxId);
        setSymbolList(updatedList);
        return symbol;
  }

    const AddChild=()=>{
      // console.log("AddChild")
      const updatedList = [...latestList.current];

      var childSymbol = GetChild();
      updatedList.push(childSymbol);

      setSymbolList(updatedList);
      setActiveSymbolId(null)

      setModalMessage("")
      // console.log(updatedList)

    }

    const GetActiveNode=()=>
    {
      const updatedList = [...latestList.current];
      const activeSymbol = updatedList.find(obj => obj.Id === activeSymbolId);

      return(activeSymbol)
    }

    const GetParent = () => {
      const updatedList = [...latestList.current];
      const MaxId = updatedList.reduce((max, item) => Math.max(max, item.Id), 0)+1;
      const activeSymbol = updatedList.find(obj => obj.Id === activeSymbolId);
      const symbol = {
          Id: MaxId,
          type:"node",
          parentId:"MainSvg",
          childs:[activeSymbol.Id],
          posX: activeSymbol.posX,
          posY: activeSymbol.posY-100,
          text:modalMessage,
        };
        updatedList[updatedList.indexOf(activeSymbol)].parentId=MaxId
        setSymbolList(updatedList);
        return symbol;
  }
    const AddParent=()=>{
      // console.log("AddChild")
      const updatedList = [...latestList.current];

      var parentSymbol = GetParent();
      updatedList.push(parentSymbol);

      setSymbolList(updatedList);
      setActiveSymbolId(null)

      setModalMessage("")
      // console.log(updatedList)

    }
    console.log(symbolList)
    const DeleteNode = ()=>{
      console.log("============Delete Node================")
      console.log("activeSymbolId: ", activeSymbolId)

      const updatedList = [...latestList.current];

      const activeSymbol = updatedList.find(obj => obj.Id === activeSymbolId);

      // console.log("activeSymbol: ", activeSymbol)
      // console.log("parentId: ", activeSymbol.parentId)

      let parentSymbol;
      if(activeSymbol.parentId != "MainSvg")
      {
        parentSymbol = updatedList.find(obj => obj.Id === activeSymbol.parentId);
      } 

      // console.log("parentSymbol: ", parentSymbol)
      // console.log("childs: ",activeSymbol.childs.length)

      if(activeSymbol.parentId != "MainSvg")
      {
        activeSymbol.childs.map( c => {
          parentSymbol.childs.push(c)
        })
      }

      if(activeSymbol.childs.length != 0)
      {
          activeSymbol.childs.map( c => {
            let childNode = updatedList.find(obj => obj.Id === c);
            childNode.parentId = activeSymbol.parentId;
            console.log("childNode:", childNode)
          })
      }

      if(activeSymbol.parentId != "MainSvg")
      {
          var index = parentSymbol.childs.indexOf(activeSymbol.Id);
          parentSymbol.childs.splice(index, 1);
      }

      activeSymbol.parentId="MainSvg"
      activeSymbol.childs=[]

      updatedList.map(node =>{
        node.childs.map( child =>
          {
            if(child == activeSymbolId)
            {
              var indexOfActiveSymbol = node.childs.indexOf(activeSymbolId);              
              node.childs.splice(indexOfActiveSymbol, 1);

            }
          }
        )
      })

      var indexOfActiveSymbol = updatedList.indexOf(activeSymbol);
      updatedList.splice(indexOfActiveSymbol, 1);

      setSymbolList(updatedList);
      console.log(updatedList);
      setActiveSymbolId(null);
      setModalMessage("");

    }

    const UpdateNode=()=>{
      const updatedList = [...latestList.current];

      const activeSymbol = updatedList.find(obj => obj.Id === activeSymbolId);
      activeSymbol.text = modalMessage;
      setSymbolList(updatedList);
      setActiveSymbolId(null);
      setModalMessage("");
    }


    const ModalNew =
    <div className="modal fade show d-block" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true" style={{backgroundColor: 'rgba(0, 0, 0, 0.40)',}} onClick={()=>{console.log("modal closed for a new node");setActiveSymbolId(null);setShow(false);setModalMessage("");}} >
      <div className="rounded-circle inputModal" style={{position:'absolute', top:`${modalY-150}px`, left:`${modalX-150}px`,width:'300px', height:'300px', background:'#666',paddingLeft:'50px',paddingTop:'40px'}} onClick={(e) =>e.stopPropagation()}>

            <input
                  type="text"
                  name="firstName"
                  onChange={ (event) => setModalMessage(event.target.value) }
                  value={modalMessage}
                  style={{width:'9rem',position:'fixed', top:`${modalY-70}px`, left:`${modalX-75}px`, borderRadius:'6px'}}
                  maxLength="5"
                  className="text-center"
                  placeholder='Your text'
                  />
                  <br/>
            <button className='btn btn-success menuButton' style={{position:'fixed', top:`${modalY-0}px`, left:`${modalX-52}px`, width:'100px', minHeight:'40px'}} onClick={()=>{console.log("click on button - 1"); AddSymbol(); setShow(false);}}> Add New Node! </button>
        </div>
    </div>

const ModalFire =
<div className="modal fade show d-block" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true" style={{backgroundColor: 'rgba(0, 0, 0, 0.40)',}} onClick={()=>{console.log("modal closed for a node");setActiveSymbolId(null);setShow(false);setModalMessage("");}} >
  <div className="rounded-circle inputModal" style={{position:'absolute', top:`${modalY-150}px`, left:`${modalX-150}px`,width:'300px', height:'300px', background:'#666',paddingLeft:'50px',paddingTop:'40px'}} onClick={(e) =>e.stopPropagation()}>
        <p className="text-light" style={{position:'fixed', top:`${modalY-120}px`, left:`${modalX-30}px`}}>Node: {activeSymbolId} </p>
        <input
                  type="text"
                  name="firstName"
                  onChange={ (event) => setModalMessage(event.target.value) }
                  value={modalMessage}
                  maxLength="5"
                  className="text-center"
                  placeholder='Your text'
                  style={{width:'9rem',position:'fixed', top:`${modalY-80}px`, left:`${modalX-95}px`, borderRadius:'6px'}}/>
        <button className='btn btn-success rounded-circle' style={{position:'fixed', top:`${modalY-88}px`, left:`${modalX+60}px`, width:'3rem',height:'3rem',}} onClick={()=>{UpdateNode();setShow(false);}}>OK</button>
        <button className='btn btn-info text-wrap menuButton' style={{position:'fixed', top:`${modalY-20}px`, left:`${modalX+20}px`, width:'100px', minHeight:'40px',}} onClick={()=>{AddChild(); setShow(false);}}> Add as a Child! </button>

  
  <button className='btn btn-primary text-wrap menuButton' style={{position:'fixed', top:`${modalY-20}px`, left:`${modalX-120}px`, width:'100px', minHeight:'40px',}} onClick={()=>{AddParent(); setShow(false);}}> Add as a Parent! </button>

  
        
        <button className='btn btn-danger text-wrap menuButton' style={{position:'fixed', top:`${modalY+80}px`, left:`${modalX-50}px`, width:'100px', minHeight:'40px',}} onClick={()=>{DeleteNode(); setShow(false);}}> Del! </button>
    </div>
</div>

    const Symbols = symbolList.map((symbol) => {
                var borderRadius
                if(symbol.parentId == "MainSvg") borderRadius = 0
                else if(symbol.childs.length != 0) borderRadius = 0
                else borderRadius = 40;

                return(
                    <g key={symbol.Id}>
                        <g className="symbol"
                            onMouseDown={
                              (e)=>
                              {
                                setActiveSymbolId(symbol.Id);
                                HandleDragStart(e)
                              }
                            }

                            onMouseUp={
                              (e)=>HandleDragEnd(e)
                            } >

                            <rect className="node" style={{filter:'url(#shadow)'}} id={symbol.Id} x={symbol.posX} y={symbol.posY} width="180" height="80" fill="#ccc"  strokeWidth="1" rx={borderRadius}/>

                            {/* <text x={symbol.posX + 90} y={symbol.posY+50} fill="#999" fontSize="36" textAnchor='middle'>{symbol.Id}</text> */}
                            <text x={symbol.posX + 90} y={symbol.posY+50} fill="#999" fontSize="36" textAnchor='middle'>{symbol.text}</text>
                            {/* <text x={symbol.posX + 90} y={symbol.posY+70} fill="#bc5050" fontSize="16" textAnchor='middle'>{symbol.text}</text> */}

                        </g>
                    </g>
                )
    })
//     const Lines = symbolList.map(symbol => {

//         symbol.childs?.map(
//           child => {
//             console.log("---------->>>>>", child)
//             const updatedList = [...latestList.current];
//               var childNode = updatedList.find(obj => obj.Id === child);
//               return(<line x1={symbol.posX} y1={symbol.posY} x2={childNode.posX} y2={childNode.posY} stroke="red" strokeWidth="3"/>)

// })
//     })


    const GetSvgPos = (x,y) =>{
        var svg = document.getElementById("MainSvg")
        var CTM = svg.getScreenCTM();
        return [Math.round((x - CTM.e) / CTM.a), Math.round((y - CTM.f) / CTM.d)]
    }

    const HandleDragStart = (e) => {
        let [svgX, svgY] = GetSvgPos(e.clientX,e.clientY)
        // console.log("HandleDragStart: ", svgX,svgY);
        setPosXFirst(e.clientX)
        setPosYFirst(e.clientY)

    }

    const HandleDragging = (x, y) => {
        if(activeSymbolId == null) return;
        let [svgX, svgY] = GetSvgPos(x,y)
        const updatedList = [...latestList.current];
        const symbol = updatedList.find(obj => obj.Id === activeSymbolId);
        updatedList[updatedList.indexOf(symbol)].posX = svgX-80
        updatedList[updatedList.indexOf(symbol)].posY = svgY-40



        setSymbolList(updatedList);
    }

    const HandleDragEnd = (e) => {
        // console.log("HandleDragEnd-1")



        if(activeSymbolId !== null) {

          if(e.clientX == posXFirst && e.clientY == posYFirst)
          {
            var x = e.clientX;
            var y = e.clientY;
            if(x > 150 && x < window.innerWidth - 150) setModalX(x);
            else if(x > window.innerWidth - 150) setModalX(window.innerWidth - 150);
            else setModalX(150);

            if(y > 150 && y < window.innerHeight - 150) setModalY(y);
            else if(y > window.innerHeight - 150) setModalY(window.innerHeight - 150);
            else setModalY(150);

            const updatedList = [...latestList.current];
            const activeSymbol = updatedList.find(obj => obj.Id === activeSymbolId);
            setModalMessage(activeSymbol.text)

            setShow(true);
            setModal("fire");

          }
          else{

            setActiveSymbolId(null)
          }

            // const updatedList = [...latestList.current];
            // const symbol = updatedList.find(obj => obj.Id === activeSymbolId);
            // console.log("HandleDragEnd-2")

        }
    }

    // console.log(symbolList)
    // console.log(modalX , modalY)
/////////////////zooming end

    return (
    <div id="PlanContainer" style={{width:'100vw', height:'100vh'}}>
        {/* {show && ModalNew} */}


      {
                    (() => {
                        if (show)
                        {
                            if (modal === "new")
                                return ModalNew
                            else if (modal === "fire")
                                return ModalFire
                        }
                    })()
        }

        {/* <p style={{position:'fixed',top:'100px', left:'100px', color:'red'}}>activeSymbolId: {activeSymbolId}</p> */}

        <div id="SvgContainer" >
            <svg id="MainSvg" xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${window.innerWidth}  ${window.innerHeight}`} onMouseDown={(e)=>HandleDragStart(e)} onMouseMove={(e)=>{HandleDragging(e.clientX, e.clientY);}} onMouseUp={(e)=>{HandleClickOnSvgContainer(e);}}>
            
                <defs>
                  <filter id="shadow">
                    <feDropShadow dx="2" dy="2" stdDeviation="6" floodColor={'#33f8'}/>
                    {/* <feDropShadow dx="8" dy="10" stdDeviation="8" flood-color="#333" /> */}
                    <feGaussianBlur stdDeviation="1 1" />
                  </filter>

                </defs>

                <circle cx="100" cy="100" r="50"  fill="red" onClick={()=>setSymbolList([])}/>
                <circle cx="100" cy="100" r="43"  fill="none" stroke="white" strokeWidth="2" onClick={()=>setSymbolList([])}/>
                <text x="80" y= "105" fill='white' style={{fontSize:'18px',}} onClick={()=>setSymbolList([])}>Reset</text>




                  <text x="50" y= "200" fill='red' style={{fontSize:'20px',}}>NumOfNodes: { symbolList.length }</text>
                  <text x="50" y= "250" fill='red' style={{fontSize:'20px',}}>ActiveNode: { activeSymbolId }</text>


                  {symbolList.map((symbol) => {
                      return(symbol.childs.map((child,j)=>{
                        var childNode = symbolList.find(obj => obj.Id === child)
                        return(
                        <>
                        {/* <text x={(i*40 + 100).toString()} y={(j*40 + 200).toString()} fill='red' style={{fontSize:'30px',}}>{ child }</text> */}
                        <line key={symbol.Id} x1={symbol.posX+90} y1={symbol.posY+40} x2={childNode.posX+90} y2={childNode.posY+40} stroke="#ddd" strokeWidth="3"/>

                        </>

                        )
                      })
                  )
                  })}

                { Symbols }
            </svg>
        </div>



    </div> );
}

export default PlotSymbols;