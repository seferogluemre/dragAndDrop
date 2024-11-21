import { Container, Form, Row } from "react-bootstrap";
import "./App.scss";
import { useState } from "react";
import { DragDropContext, DropResult, Droppable, Draggable } from "react-beautiful-dnd";
import { styled } from 'styled-components'
import { nanoid } from "nanoid";
import { MdDelete, MdEdit } from "react-icons/md";
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

interface Quote {
  id: string;
  content: string;
}

// Styled Components
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
  const [items, setItems] = useState<Quote[]>([]);
  const [newItemContent, setNewItemContent] = useState<string>("");
  const [inputEdit, setInputEdit] = useState<string>("");
  const [selectItemId, setSelectItemId] = useState<string>("");
  const [open, setOpen] = useState(false);

  const onCloseModal = () => setOpen(false);

  // Bu fonksiyon Bir Quote Listesi alır ve alttaki parametreler hangi ögenin hangi pozisyondan bir pozisyona taşıncagını belli eder
  const reorder = (list: Quote[], startIndex: number, endIndex: number): Quote[] => {
    // Orjinal listeyi kopyalama
    const result = Array.from(list);
    // Başlangıçdaki ögeyi kaldırma
    const [removed] = result.splice(startIndex, 1);
    // Yeni pozisyon
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    const reorderedItems = reorder(items, source.index, destination.index);
    setItems(reorderedItems);
  };

  // İçerik iconuna tıklama olduğunda modalı açıp içerği modaldaki inputa yansıtma
  const openModel = (id: string, content: string) => {
    setOpen(true);
    setInputEdit(content);
    setSelectItemId(id);
  }

  // Silme işlemi
  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  }

  // Ekleme işlemi
  const handleAddItem = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!newItemContent.trim()) return;
    const formattedName = newItemContent.trim();
    const newItem: Quote = {
      id: nanoid(7),
      content: formattedName.toLowerCase(),
    }
    setItems([...items, newItem]);
    setNewItemContent("");
  }

  // Öğeyi güncelleme
  const handleRenameItemContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEdit.trim()) return;

    setItems(items.map(item =>
      item.id === selectItemId
        ? { ...item, content: inputEdit.trim() }
        : item
    ));

    setOpen(false);
    setInputEdit("");
  }

  return (
    <>
      <div className="container justify-content-center d-flex">
        <Row>
          <Form className="form" >
            <FormControl
              value={newItemContent}
              onChange={(e) => setNewItemContent(e.target.value)}
              placeholder="New Todo...."
              type="text"
            />
            <AddBtn type="button" onClick={handleAddItem}>Ekle</AddBtn>
          </Form>
        </Row>
      </div>
      <Container>
        <Row>
          <DragDropContext onDragEnd={onDragEnd}>
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
        <Form className="d-flex column-gap-4 p-2 m-3" onSubmit={handleRenameItemContent}>
          <FormControl
            value={inputEdit}
            onChange={(e) => setInputEdit(e.target.value)}
            placeholder="Edit Item..."
            type="text"
          />
          <AddBtn onClick={handleRenameItemContent}>Edit</AddBtn>
        </Form>
      </Modal>
    </>
  );
}

export default App; 
