import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import AppBreadcrumb from "../../../components/_pesitos/AppBreadcrumb";
import { contactServiceInstance } from "../../../services/contacts/ContactService";
import { useCallback } from "react";
export const ContactForm = () => {
  // Refs
  const toast = useRef();

  // Hooks
  const navigate = useNavigate();
  const {contactId } = useParams();
  const [contact, setContact] = useState(null);
  const [name, setName] = useState(null);
  const [linkedin, setLinkedin] = useState(null);
  const [email, setEmail] = useState(null);
  const [company, setCompany] = useState(null);

// Effects
// Functions
const fetchContact = useCallback(async () => {
  try {
    const { data: response } = await contactServiceInstance.getContact(
      contactId
    );
    setContact(response);
    setName(response.name);
    setLinkedin(response.linkedin);
    setEmail(response.email);
    setCompany(response.company);
  } catch (error) {
    console.error(error);
  }
}, [contactId]);

// Effects
useEffect(() => {
  if (contactId) {
    fetchContact();
  }
}, [contactId, fetchContact]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Por favor, complete todos los campos obligatorios",
        life: 3000,
      });
      return;
    }

    const data = {
      name,
      linkedin,
      email,
      company,
    };

    try {
      let response;
      if (contact) {
        response = await contactServiceInstance.updateContact(contact.id, data);
        toast.current.show({
          severity: "success",
          summary: "Exito",
          detail: `Contacto ${name} actualizada`,
          life: 3000,
        });
      } else {
        await contactServiceInstance.createContact(data);
        toast.current.show({
          severity: "success",
          summary: "Exito",
          detail: `Contacto ${name} creada`,
          life: 3000,
        });
      }


    } catch (error) {
      console.error(error);
    }
  };

  const goBackRoleList = () => {
    navigate("/contacts");
  };

  // Render
  return (
    <div>
      <AppBreadcrumb
        meta={contactId ? "Contactos / Editar" : "Contactos / Nuevo"}
      />
      <div className="layout-content">
        <Toast ref={toast} onHide={() => navigate("/contacts")} />
        <div className="grid">
          <div className="col-12">
            <div className="card">
              <h5>{contactId ? "Editar contacto" : "Nueva contacto"}</h5>
              <form onSubmit={handleSubmit}>
                <div className="card p-fluid">
                  <div className="field">
                    <label htmlFor="name">Nombre</label>
                    <InputText
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="linkedin">LinkedIn</label>
                    <InputText
                      id="linkedin"
                      type="text"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="email">Email</label>
                    <InputText
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="company">Empresa</label>
                    <InputText
                      id="company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-content-end mt-2">
                  <div className="p-d-flex">
                    <Button
                      label="Volver"
                      icon="pi pi-arrow-circle-left"
                      className="p-button-raised p-button-secondary mr-2 mb-2"
                      onClick={goBackRoleList}
                    />
                  </div>
                  <div className="p-d-flex">
                    <Button
                      type="submit"
                      label={contact ? "Actualizar" : "Guardar"}
                      icon="pi pi-save"
                      className="p-button-raised p-button-success"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
