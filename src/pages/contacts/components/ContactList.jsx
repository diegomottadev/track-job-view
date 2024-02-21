import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import Error from '../../../components/Error';
import ContactToolbar from './ContactToolbar';
import { contactServiceInstance } from '../../../services/contacts/ContactService';

const ContactList = () => {
    // Refs
    const dt = useRef(null);
    const toast = useRef();

    // Hooks
    const navigate = useNavigate();
    const [contacts, setContacts] = useState(false);
    const [loadingDatatable, setLoadingDatatable] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [showError, setShowError] = useState(false);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 0,
        search: null
    });
    // Functions
    const loadLazyData = useCallback(async () => {
        try {
            setLoadingDatatable(true);
            const { data: { data: result, count: total } } = await contactServiceInstance.allContacts(lazyParams);
            setTotalRecords(total);
            setContacts(result);
            setLoadingDatatable(false);
        } catch (err) {
            console.error(err);
            console.warn('Hubo un problema con la carga del listado de contactos');
            setShowError(true);
            setLoadingDatatable(false);
        }
    }, [lazyParams, setLoadingDatatable, setTotalRecords, setContacts, setShowError]);

    // Effects
    useEffect(() => {
        loadLazyData();
    }, [lazyParams,loadLazyData]);




    const onPage = (event) => {
        let _lazyParams = { ...lazyParams, ...event };
        setLazyParams(_lazyParams);
    };

    const onFilter = (e) => {
        const search = { search: { name: e.target.value } };
        let _lazyParams = { ...lazyParams, ...search };
        _lazyParams['first'] = 0;
        setLazyParams(_lazyParams);
    };

    const onEditContact = (contactId) => {
        navigate(`/contacts/${contactId}/edit`);
    };

    
    const onDeleteContact = async (contactId) => {
        try {
            const result = await Swal.fire({
                title: '',
                text: '¿Confirma eliminar el contacto permanentemente?',
                showCancelButton: true,
                confirmButtonText: `<i class="pi pi-check-circle"></i> Aceptar`,
                cancelButtonText: `<i class="pi pi-ban"></i> Cancelar`,
                confirmButtonColor: '#2196F3',
                cancelButtonColor: '#fbc02d',
            });

            if (result.isConfirmed) {
                const roleDelete = await contactServiceInstance.deleteContact(contactId);
                toast.current.show({
                    severity: 'success',
                    summary: 'Éxito',
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
            console.error('Error de solicitud:', error.response.data);
            Swal.fire('Error', 'Hubo un error al procesar la solicitud', 'error');
        } else if (error.request) {
            console.error('Error de respuesta:', error.request);
            Swal.fire('Error', 'No se recibió respuesta del servidor', 'error');
        } else {
            console.error('Error:', error.message);
            Swal.fire('Error', 'Ocurrió un error al realizar la solicitud', 'error');
        }
    };

    // Templates
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">&nbsp;</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => onFilter(e)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button tooltip={"Editar"} tooltipOptions={{ position: 'top' }} icon="pi pi-pencil" className="p-button-raised p-button-success p-mr-2" onClick={() => onEditContact(rowData.id)} />
                <Button tooltip={"Eliminar"} tooltipOptions={{ position: 'top' }} icon="pi pi-trash" className="p-button-raised p-button-danger p-mr-2" onClick={() => onDeleteContact(rowData.id)} />
            </div>
        );
    }

    // Render
    if (showError) {
        return (
            <Error mensaje={'Hubo un problema con la carga del listado de contactos'}></Error>
        );
    }

    return (
        <div>
            <ContactToolbar params={lazyParams.search} />
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <h5>Contactos</h5>
                        <Toast ref={toast} />
                        <DataTable ref={dt} value={contacts} lazy
                            paginator first={lazyParams.first} rows={10} totalRecords={totalRecords} onPage={onPage}
                            loading={loadingDatatable}
                            className="p-datatable-gridlines" header={header}
                        >
                            <Column field="name" header="Nombre" headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                            <Column field="email" header="Email" ></Column>
                            <Column field="linkedin" header="LinkedIn" ></Column>
                            <Column field="company" header="Empresa" ></Column>
                            <Column body={actionBodyTemplate}></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactList;
