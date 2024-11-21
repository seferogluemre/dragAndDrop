// eslint-disable-next-line no-unused-vars
import { Container, Form, Row } from "react-bootstrap";
import "./App.scss";
import { useState } from "react";
import { DragDropContext, DropResult, Droppable, Draggable } from "react-beautiful-dnd";
import { styled } from 'styled-components'
import { nanoid } from "nanoid";
import { MdDelete, MdEdit } from "react-icons/md";
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

interface Item {
  id: string;
  content: string;
}



const FormControl = styled.input`
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
const AddBtn = styled.button`
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

  const [open, setOpen] = useState(false);

  const onCloseModal = () => setOpen(false);


  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // Eğer bırakılan hedef yoksa işlemi sonlandır
    if (!destination) return;

    const reorderedItems = Array.from(items);
    const [removed] = reorderedItems.splice(source.index, 1);
    reorderedItems.splice(destination.index, 0, removed);

    setItems(reorderedItems);
  };

  const openModel = (id: string, content: string) => {
    setOpen(true)
  }

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const handleAddItem = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!newItemContent.trim()) return;

    const formattedName = newItemContent.trim();

    const newItem: Item = {
      id: nanoid(7),
      content: formattedName.toLowerCase(),
    }
    setItems([...items, newItem])
    setNewItemContent("")


  }


  return (
    <>
      <div className="container justify-content-center d-flex">
        <Row>
          <Form className="form">
            <FormControl value={newItemContent} onChange={(e) => setNewItemContent(e.target.value)} type="text" />
            <AddBtn type="button" onClick={handleAddItem}>Ekle</AddBtn>
          </Form>
        </Row>
      </div >
      <Container>
        <Row>
          <DragDropContext onDragEnd={ondragend}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <ul ref={provided.innerRef} className="list" {...provided.droppableProps}>
                  {items.map(({ id, content }, index) => (
                    <Draggable key={id} draggableId={id} index={index}>
                      {(provided) => (
                        <li
                          className="list-item"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {content}
                          <div className="order-content">
                            <span><MdEdit className="fs-3" onClick={() => openModel(id, content)} /></span>
                            <span><MdDelete className="fs-3" onClick={() => handleDeleteItem(id)} /></span>
                          </div>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </Row>
      </Container>
      <Modal open={open} onClose={onCloseModal} center>
        <h2></h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          pulvinar risus non risus hendrerit venenatis. Pellentesque sit amet
          hendrerit risus, sed porttitor quam.
        </p>
      </Modal>
    </>
  );
}

export default App;
