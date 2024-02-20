import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import AppBreadcrumb from "../../../components/_pesitos/AppBreadcrumb";
import { applicationServiceInstance } from "../../../services/applications/ApplicationService"; // Update import
import { useCallback } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from 'primereact/calendar';

export const ApplicationForm = () => {
  // Refs
  const toast = useRef();

  // Hooks
  const navigate = useNavigate();
  const { applicationId } = useParams(); // Update variable name
  const [application, setApplication] = useState(null); // Update state variable name
  const [position, setPosition] = useState(""); // Initialize state variables with empty strings
  const [company, setCompany] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [linkApplication, setLinkApplication] = useState("");
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [appliedDate, setAppliedDate] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const statusOptions = [
    { label: 'Applied', value: 'Applied' },
    { label: 'Interview', value: 'Interview' },
    { label: 'Code Challenge', value: 'Code Challenge' },
    { label: 'Technical Interview', value: 'Technical Interview' },
    { label: 'Offer', value: 'Offer' },
    { label: 'Rejected', value: 'Rejected' }
  ];
  
  const parseDateString = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
  };
  // Effects
  const fetchApplication = useCallback(async () => {
    try {
      const { data: response } = await applicationServiceInstance.getApplication(
        applicationId
      );
      setApplication(response);
      setPosition(response.position);
      setCompany(response.company);
      setCompanyWebsite(response.companyWebsite);
      setLinkApplication(response.linkApplication);
      setStatus(response.status);
      setNotes(response.notes);

      
      // Dentro de fetchApplication:
      setAppliedDate(parseDateString(response.appliedDate));
      setName(response.contact.name);
      setEmail(response.contact.email);
      setLinkedin(response.contact.linkedin);
    } catch (error) {
      console.error(error);
    }
  }, [applicationId]);

  // Effects
  useEffect(() => {
    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId, fetchApplication]);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!position || !company || !companyWebsite || !linkApplication || !status || !appliedDate || !name || !email || !linkedin) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Por favor, complete todos los campos obligatorios",
        life: 3000,
      });
      return;
    }
  
    let data;
    if (applicationId) {
      data = {
        position,
        company,
        companyWebsite,
        linkApplication,
        status,
        notes,
        appliedDate,
       
        contact: {
          id: application.contact.id,
          name,
          email,
          linkedin
        }
      };
    } else {
      data = {
        position,
        company,
        companyWebsite,
        linkApplication,
        status,
        notes,
        appliedDate,
        name,
        email,
        linkedin
      };
    }
  
    try {
      let response;
      if (application) {
        response = await applicationServiceInstance.updateApplication(application.id, data);
        toast.current.show({
          severity: "success",
          summary: "Exito",
          detail: `Aplicación ${position} actualizada`,
          life: 3000,
        });
      } else {
        await applicationServiceInstance.createApplication(data);
        toast.current.show({
          severity: "success",
          summary: "Exito",
          detail: `Aplicación ${position} creada`,
          life: 3000,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  const goBackApplicationList = () => {
    navigate("/applications"); // Update navigation path
  };

  // Render
  return (
    <div>
      <AppBreadcrumb
        meta={applicationId ? "Aplicaciones / Editar" : "Aplicaciones / Nuevo"} // Update breadcrumb text
      />
      <div className="layout-content">
        <Toast ref={toast} onHide={() => navigate("/applications")} /> {/* Update navigation path */}
        <div className="grid">
          <div className="col-12">
            <div className="card">
              <h5>{applicationId ? "Editar aplicación" : "Nueva aplicación"}</h5> {/* Update title */}
              <form onSubmit={handleSubmit}>
                <div className="card">
                <div className="p-fluid formgrid grid">
                  <div className="field col-12 md:col-6">
                    <label htmlFor="position">Posición</label> {/* Update labels */}
                    <InputText
                      id="position"
                      type="text"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                    />
                  </div>
                  <div className="field col-12 md:col-6">
                    <label htmlFor="company">Empresa</label>
                    <InputText
                      id="company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                  <div className="field col-12 md:col-6">
                    <label htmlFor="companyWebsite">Sitio web de la empresa</label>
                    <InputText
                      id="companyWebsite"
                      type="text"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                    />
                  </div>
                  <div className="field col-12 md:col-6">
                    <label htmlFor="linkApplication">Enlace de la oferta de trabajo</label>
                    <InputText
                      id="linkApplication"
                      type="text"
                      value={linkApplication}
                      onChange={(e) => setLinkApplication(e.target.value)}
                    />
                  </div>

                  <div className='field col-12 md:col-6'>
                    <label htmlFor="status">Estado</label>
                    <Dropdown 
                        value={status} 
                        onChange={(e) => setStatus(e.value)} 
                        options={statusOptions} 
                        placeholder="-- Seleccionar estado --" 
                    />
                    </div>
                  <div className="field col-12 md:col-6">
                    <label htmlFor="notes">Notas</label>
                    <InputTextarea
                      rows={5}
                      id="notes"
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                  <div className="field col-12 md:col-6">
                    <label htmlFor="appliedDate">Fecha de Aplicación</label>

                     <Calendar showIcon showButtonBar value={appliedDate}  onChange={(e) => setAppliedDate(e.target.value)}></Calendar>
                  </div>
                  <div className="field col-12 md:col-6">
                    <label htmlFor="name">Nombre</label>
                    <InputText
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="field col-12 md:col-6">
                    <label htmlFor="email">Correo Electrónico</label>
                    <InputText id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="field col-12 md:col-6">
                    <label htmlFor="linkedin">LinkedIn</label>
                    <InputText id="linkedin" type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                  </div>
                </div>

                <div className="flex justify-content-end mt-2">
                  <div className="p-d-flex">
                    <Button
                      label="Volver"
                      icon="pi pi-arrow-circle-left"
                      className="p-button-raised p-button-secondary mr-2 mb-2"
                      onClick={goBackApplicationList}
                    />
                  </div>
                  <div className="p-d-flex">
                    <Button
                      type="submit"
                      label={application ? "Actualizar" : "Guardar"}
                      icon="pi pi-save"
                      className="p-button-raised p-button-success"
                    />
                  </div>
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

export default ApplicationForm;
