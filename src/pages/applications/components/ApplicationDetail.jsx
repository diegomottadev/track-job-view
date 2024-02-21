import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "primereact/button";
import { applicationServiceInstance } from "../../../services/applications/ApplicationService";
import { Tag } from "primereact/tag";

const ApplicationDetail = ({ params }) => {
  const navigate = useNavigate();

  const { applicationId } = useParams(); // Update variable name
  const [application, setApplication] = useState(null); // Update state variable name


  const fetchApplication = useCallback(async () => {
    try {
      const { data: response } =
        await applicationServiceInstance.getApplication(applicationId);
      setApplication(response);

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

  const openWindow = (url) => {
    window.open(url, "_blank");
  };

  const navigateToApplications = () => {
    navigate("/applications");
  };

  return (
    <div className="layout-content">
      <div className="grid">
        <div className="col-12">
          <div className="card">
            <h5>Detalle de la postulación</h5>
            <div className="card">
              <div className="surface-0">
                <ul className="list-none p-0 m-0">
                  <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">Posición</div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                      {application?.position}
                    </div>
                  </li>
                  <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">Empresa</div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                      {application?.company}
                    </div>
                  </li>
                  <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">Sitio web de la empresa</div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                      <a
                                href={application?.companyWebsite}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => openWindow(application?.companyWebsite)}
                            >
                                {application?.companyWebsite}
                        </a>
                    </div>
                  </li>
                  <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">Enlace de la oferta</div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                      <a
                                href={application?.linkApplication}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => openWindow(application?.linkApplication)}
                            >
                                {application?.linkApplication}
                        </a>
                    </div>
                  </li>
                  <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">Estado</div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                      {getStatusTag(application?.status)}
                    </div>
                  </li>
                  <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">Notas</div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                      {application?.notes}
                    </div>
                  </li>
                  <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">Fecha aplicada</div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                      {application?.appliedDate}
                    </div>
                  </li>
                  <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">Nombre de contacto</div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                      {application?.contact?.name}
                    </div>
                  </li>
                  <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">Correo electrónico de contacto</div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                      {application?.contact?.email}
                    </div>
                  </li>
                  <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">LinkedIn de contacto</div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                      <a href={application?.contact?.linkedin} target="_blank" rel="noopener noreferrer">{application?.contact?.linkedin}</a>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="flex justify-content-end mt-2">
                <div className="p-d-flex">
                  <Button
                    label="Volver"
                    icon="pi pi-arrow-circle-left"
                    className="p-button-raised p-button-secondary mr-2 mb-2"
                    onClick={navigateToApplications}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
