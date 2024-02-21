import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import Error from "../../../components/Error";
import ApplicationToolbar from "./ApplicationToolbar";
import { applicationServiceInstance } from "../../../services/applications/ApplicationService";
import { Tag } from "primereact/tag";
import { Tooltip } from "primereact/tooltip";

const ApplicationList = () => {
  // Refs
  const dt = useRef(null);
  const toast = useRef();

  // Hooks
  const navigate = useNavigate();
  const [applications, setApplications] = useState(false);
  const [loadingDatatable, setLoadingDatatable] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showError, setShowError] = useState(false);

  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 10,
    page: 0,
    search: null,
  });
  // Functions
  const loadLazyData = useCallback(async () => {
    try {
      setLoadingDatatable(true);
      const {
        data: { data: result, count: total },
      } = await applicationServiceInstance.allApplications(lazyParams);
      setTotalRecords(total);
      setApplications(result);
      setLoadingDatatable(false);
    } catch (err) {
      console.error(err);
      console.warn(
        "Hubo un problema con la carga del listado de postulaciones"
      );
      setShowError(true);
      setLoadingDatatable(false);
    }
  }, [
    lazyParams,
    setLoadingDatatable,
    setTotalRecords,
    setApplications,
    setShowError,
  ]);

  // Effects
  useEffect(() => {
    loadLazyData();
  }, [lazyParams, loadLazyData]);

  const onPage = (event) => {
    let _lazyParams = { ...lazyParams, ...event };
    setLazyParams(_lazyParams);
  };

  const onFilter = (e) => {
    const search = { search: { name: e.target.value } };
    let _lazyParams = { ...lazyParams, ...search };
    _lazyParams["first"] = 0;
    setLazyParams(_lazyParams);
  };

  const onEditApplication = (applicationId) => {
    navigate(`/applications/${applicationId}/edit`);
  };

  const onViewApplication = (applicationId) => {
    navigate(`/applications/${applicationId}`);
  };

  const onDeleteApplication = async (applicationId) => {
    try {
      const result = await Swal.fire({
        title: "",
        text: "¿Confirma eliminar la postulación permanentemente?",
        showCancelButton: true,
        confirmButtonText: `<i class="pi pi-check-circle"></i> Aceptar`,
        cancelButtonText: `<i class="pi pi-ban"></i> Cancelar`,
        confirmButtonColor: "#2196F3",
        cancelButtonColor: "#fbc02d",
      });

      if (result.isConfirmed) {
        const roleDelete = await applicationServiceInstance.deleteContact(
          applicationId
        );
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: `${roleDelete.message}`,
          life: 3000,
        });
        setLazyParams({ ...lazyParams, page: lazyParams.page });
      }
    } catch (error) {
      handleRequestError(error);
    }
  };

  const handleRequestError = (error) => {
    if (error.response) {
      console.error("Error de solicitud:", error.response.data);
      Swal.fire("Error", "Hubo un error al procesar la solicitud", "error");
    } else if (error.request) {
      console.error("Error de respuesta:", error.request);
      Swal.fire("Error", "No se recibió respuesta del servidor", "error");
    } else {
      console.error("Error:", error.message);
      Swal.fire("Error", "Ocurrió un error al realizar la solicitud", "error");
    }
  };

  // Templates
  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">&nbsp;</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => onFilter(e)}
          placeholder="Buscar..."
        />
      </span>
    </div>
  );

  const actionBodyTemplate = (rowData) => {
    return (
      <div>


        <div className="actions" style={{display: "flex"}}>
          <Button
            className="custom-tooltip-btn"
            type="button"
            icon="pi pi-external-link"
            tooltipOptions={{ position: 'left' }} 
            tooltip={rowData.notes}
          />
          <Button
            tooltip={"Ver"}
            tooltipOptions={{ position: "top" }}
            icon="pi pi-eye"
            className="p-button-raised p-button-info p-mr-2"
            onClick={() => onViewApplication(rowData.id)}
          />
          <Button
            tooltip={"Editar"}
            tooltipOptions={{ position: "top" }}
            icon="pi pi-pencil"
            className="p-button-raised p-button-success p-mr-2"
            onClick={() => onEditApplication(rowData.id)}
          />
          <Button
            tooltip={"Eliminar"}
            tooltipOptions={{ position: "top" }}
            icon="pi pi-trash"
            className="p-button-raised p-button-danger p-mr-2"
            onClick={() => onDeleteApplication(rowData.id)}
          />
        </div>
      </div>
    );
  };

  const openLinkedInProfile = (linkedin) => {
    window.open(linkedin, "_blank");
  };

  const actionContactTemplate = (rowData) => {
    const contact = { ...rowData.contact };
    return (
      <div className="p-grid p-dir-col">
        <div className="p-col">{contact?.name}</div>
        <div className="p-col">{contact?.email}</div>
        <div className="p-col">
          <a
            href={contact?.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => openLinkedInProfile(contact?.linkedin)}
          >
            {contact?.linkedin}
          </a>
        </div>
      </div>
    );
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "Applied":
        return <Tag className="mr-2" value="Applied" severity="info" />;
      case "Interview":
        return <Tag className="mr-2" value="Interview" severity="warning" />;
      case "Code Challenge":
        return <Tag className="mr-2" value="Code Challenge" severity="info" />;
      case "Technical Interview":
        return (
          <Tag
            className="mr-2"
            value="Technical Interview"
            severity="warning"
            style={{ backgroundColor: "#FF9800" }}
          />
        );
      case "Offer":
        return <Tag className="mr-2" value="Offer" severity="success" />;
      case "Rejected":
        return <Tag className="mr-2" value="Rejected" severity="danger" />;
      default:
        return null;
    }
  };
  
  const actionStatusTemplate = (rowData) => {
    return <div>{getStatusTag(rowData.status)}</div>;
  };

  // Render
  if (showError) {
    return (
      <Error
        mensaje={"Hubo un problema con la carga del listado de postulaciones"}
      ></Error>
    );
  }

  return (
    <div>
      <ApplicationToolbar params={lazyParams.search} />
      <div className="grid">
        <div className="col-12">
          <div className="card">
            <h5>Postulaciones</h5>
            <Toast ref={toast} />
            <DataTable
              ref={dt}
              value={applications}
              lazy
              paginator
              first={lazyParams.first}
              rows={10}
              totalRecords={totalRecords}
              onPage={onPage}
              loading={loadingDatatable}
              className="p-datatable-gridlines"
              header={header}
            >
              <Column
                field="position"
                header="Puesto"
                headerStyle={{ width: "14%", minWidth: "10rem" }}
              ></Column>
              <Column field="company" header="Empresa"></Column>
              <Column body={actionStatusTemplate} header="Estado"></Column>
              <Column field="appliedDate" header="Aplicado"></Column>
              <Column body={actionContactTemplate} header="Contacto"></Column>
              <Column field="appliedDate" header="Entrevista"></Column>
              <Column body={actionBodyTemplate}></Column>
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationList;
