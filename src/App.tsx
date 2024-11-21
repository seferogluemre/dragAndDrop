import {  Form,  Row } from "react-bootstrap";
import "./App.scss";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {styled} from 'styled-components'
import { nanoid } from "nanoid";

interface Item {
  id: string;
  content: string;
}


const FormControl=styled.input`
    width: 100%;
    padding: .375rem .75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    border: none;
    border-radius: 15px;
    outline:none;
    box-shadow: 0 6px 7px gray;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
`
const AddBtn=styled.button`
    padding: 3px 26px;
    border: none;
    box-shadow: 0 3px 2px gray;
    color: white;
    border-radius: 15px;
    font-weight: bold;
    background-color: #DEAA79;

`














function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [newItemContent, setNewItemContent] = useState<string>("");

  const handleAddItem=()=>{
    if(!newItemContent.trim())return;

    const formattedName=newItemContent.trim();

    const newItem:Item={
      id:nanoid(7),
      content:formattedName.toLowerCase(),
    }
    setItems([...items,newItem])
    console.log(items)
  


  }






  return (
    <>
      <div className="container justify-content-center d-flex">
        <Row>
          <Form className="form">
            <FormControl  value={newItemContent} onChange={(e)=>setNewItemContent(e.target.value)}  type="text"/>
            <AddBtn type="button" onClick={handleAddItem}>Ekle</AddBtn>
          </Form>
        </Row>
        <Row>
          
           <Droppable droppableId="droppable">          
            {(provided) => (
              <ul ref={provided.innerRef} {...provided.droppableProps}>
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {item.content}
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable> 
        </Row>
      </div>
    </>
  );
}

export default App;
