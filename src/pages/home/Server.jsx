import React, { useEffect, useState } from 'react';
import {
  CCard, CCardBody, CCol, CCardHeader, CRow, CSpinner,
  CTable, CTableBody, CTableHeaderCell,
  CTableRow, CTableDataCell, CTableHead,
  CAlert
} from "@coreui/react";
import "../../css/Server.css";

// Server configuration
const SERVER_BASE_URL = 'http://88.198.18.234:3001';
const PROXMOX_API_URL = 'https://46.4.244.15:8006/api2/json';
const PROXMOX_TOKEN = 'PVEAPIToken=API@pve!C6e4dS3gnP2Jbw6E8Lnq86zH=a2a7026a-8872-4dd4-a427-d60596dcc1b8';

const Server = () => {
  const [nodes, setNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [vms, setVms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingVms, setLoadingVms] = useState(false);
  const [error, setError] = useState(null);
  const [vmsError, setVmsError] = useState(null);
  const [backups, setBackups] = useState([]);
  const [loadingBackups, setLoadingBackups] = useState(false);
  const [backupError, setBackupError] = useState(null);

  const fetchVms = async (node) => {
    setLoadingVms(true);
    setVmsError(null);
    try {
      const url = `${SERVER_BASE_URL}/api/nodes/${node}/vias`;
      console.log(`Fetching VMs from: ${url}`);
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch VMs: ${response.status} - ${errorText}`);
      }
      const json = await response.json();
      console.log('Received VMs data:', json);
      console.log('VM list:', JSON.stringify(json.data, null, 2));
      setVms(json.data || []);
    } catch (err) {
      console.error('Error fetching VMs:', err);
      setVmsError(`Failed to fetch VMs: ${err.message}`);
    } finally {
      setLoadingVms(false);
    }
  };

  const fetchBackups = async (node) => {
    setLoadingBackups(true);
    setBackupError(null);
    try {
      const response = await fetch(`${SERVER_BASE_URL}/api/nodes/${node}/storage/dcuk01pbsinhouseUKBackup/content`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch backups: ${response.status} - ${errorText}`);
      }
      const json = await response.json();
      console.log('Received backup data:', json);
      setBackups(json.data || []);
    } catch (err) {
      console.error('Error fetching backups:', err);
      setBackupError(`Failed to fetch backups: ${err.message}`);
    } finally {
      setLoadingBackups(false);
    }
  };

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        setError(null);
        console.log('Fetching nodes from:', `${SERVER_BASE_URL}/api/nodes`);
        const response = await fetch(`${SERVER_BASE_URL}/api/nodes`);
        if (!response.ok) {
          throw new Error(`Failed to fetch nodes: ${response.status}`);
        }
        const json = await response.json();
        console.log('Received nodes data:', json);
        setNodes(json.data || []);
      } catch (err) {
        console.error('Error fetching nodes:', err);
        setError('Failed to fetch nodes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNodes();
  }, []);

  useEffect(() => {
    if (!selectedNode) return;
    fetchVms(selectedNode);
    fetchBackups(selectedNode);
  }, [selectedNode]);

  const startVM = async (node, vmid) => {
    try {
      const response = await fetch(`${SERVER_BASE_URL}/api/nodes/${node}/qemu/${vmid}/status/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to start VM: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error starting VM:', error);
      throw error;
    }
  };

  const shutdownVM = async (node, vmid) => {
    try {
      const response = await fetch(`${SERVER_BASE_URL}/api/nodes/${node}/qemu/${vmid}/status/shutdown`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to shutdown VM: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error shutting down VM:', error);
      throw error;
    }
  };

  const handleStartVM = async (node, vmid) => {
    try {
      setError(null);
      await startVM(node, vmid);
      // Refresh the VM list after starting
      fetchVms(node);
    } catch (error) {
      console.error('Error starting VM:', error);
      setError('Failed to start VM: ' + error.message);
    }
  };

  const handleShutdownVM = async (node, vmid) => {
    try {
      setError(null);
      await shutdownVM(node, vmid);
      // Refresh the VM list after shutting down
      fetchVms(node);
    } catch (error) {
      console.error('Error shutting down VM:', error);
      setError('Failed to shutdown VM: ' + error.message);
    }
  };

  return (
    <div className="container">
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <span className="card-title">Proxmox Nodes</span>
            </CCardHeader>
            <CCardBody>
              {error && (
                <CAlert color="danger" className="mb-4">
                  {error}
                </CAlert>
              )}
              {loading ? (
                <div className="spinner-container">
                  <CSpinner color="info" />
                </div>
              ) : (
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Node</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
        {nodes.map((node) => (
                      <CTableRow
                        key={node.node}
                        className={selectedNode === node.node ? 'selected-node' : ''}
                        onClick={() => setSelectedNode(node.node)}
                        style={{ cursor: 'pointer' }}
                      >
                        <CTableDataCell>{node.node}</CTableDataCell>
                        <CTableDataCell>{node.status}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {selectedNode && (
        <>
          <CRow>
            <CCol xs>
              <CCard className="mb-4">
                <CCardHeader>
                  <span className="card-title">VMs in {selectedNode}</span>
                </CCardHeader>
                <CCardBody>
                  {vmsError && (
                    <CAlert color="danger" className="mb-4">
                      {vmsError}
                    </CAlert>
                  )}
                  {loadingVms ? (
                    <div className="spinner-container">
                      <CSpinner color="info" />
                    </div>
                  ) : vms.length === 0 ? (
                    <CAlert color="info">
                      No VMs found in this node.
                    </CAlert>
                  ) : (
                    <CTable>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>VMID</CTableHeaderCell>
                          <CTableHeaderCell>Name</CTableHeaderCell>
                          <CTableHeaderCell>Status</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {vms.map((vm) => (
                          <CTableRow key={vm.vmid} className="vm-row">
                            <CTableDataCell>
                              <span className="vm-id">#{vm.vmid}</span>
                            </CTableDataCell>
                            <CTableDataCell>
                              <span className="vm-name-text">{vm.name}</span>
                            </CTableDataCell>
                            <CTableDataCell>
                              <div className="status-container">
                                <span className={`status-badge ${vm.status}`}>
                                  {vm.status}
                                </span>
                                {vm.status === 'running' && (
                                  <button
                                    className="status-action shutdown"
                                    onClick={() => handleShutdownVM(selectedNode, vm.vmid)}
                                    title="Shutdown VM"
                                  >
                                    Shutdown
                                  </button>
                                )}
                                {vm.status === 'stopped' && (
                                  <button
                                    className="status-action start"
                                    onClick={() => handleStartVM(selectedNode, vm.vmid)}
                                    title="Start VM"
                                  >
                                    Start
                                  </button>
                                )}
                              </div>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          <CRow>
            <CCol xs>
              <CCard className="mb-4">
                <CCardHeader>
                  <span className="card-title">Backups</span>
                </CCardHeader>
                <CCardBody>
                  {backupError && (
                    <CAlert color="danger" className="mb-4">
                      {backupError}
                    </CAlert>
                  )}
                  {loadingBackups ? (
                    <div className="spinner-container">
                      <CSpinner color="info" />
                    </div>
                  ) : backups.length === 0 ? (
                    <CAlert color="info">
                      No backups found.
                    </CAlert>
                  ) : (
                    <CTable>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>Volume ID</CTableHeaderCell>
                          <CTableHeaderCell>Notes</CTableHeaderCell>
                          <CTableHeaderCell>Format</CTableHeaderCell>
                          <CTableHeaderCell>Size</CTableHeaderCell>
                          <CTableHeaderCell>Encrypted</CTableHeaderCell>
                          <CTableHeaderCell>Verify State</CTableHeaderCell>
                          <CTableHeaderCell>Date</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {backups.map((backup) => (
                          <CTableRow key={backup.volid}>
                            <CTableDataCell>
                              <span className="backup-volid">
                                {backup.volid.split('dcuk01pbsinhouseUKBackup:')[1] || backup.volid}
                              </span>
                            </CTableDataCell>
                            <CTableDataCell>
                              <span className="backup-notes">{backup.notes || '-'}</span>
                            </CTableDataCell>
                            <CTableDataCell>
                              <span className="backup-format">{backup.format}</span>
                            </CTableDataCell>
                            <CTableDataCell>
                              <span className="backup-size">
                                {(backup.size / (1024 * 1024 * 1024)).toFixed(2)} GB
                              </span>
                            </CTableDataCell>
                            <CTableDataCell>
                              <span className={`backup-encrypted ${backup.encrypted ? 'encrypted' : 'unencrypted'}`}>
                                {backup.encrypted ? 'Yes' : 'No'}
                              </span>
                            </CTableDataCell>
                            <CTableDataCell>
                              <span className={`backup-verify-state ${backup.verify_state || 'unknown'}`}>
                                {backup.verify_state || 'Unknown'}
                              </span>
                            </CTableDataCell>
                            <CTableDataCell>
                              <span className="backup-date">
                                {new Date(backup.ctime * 1000).toLocaleString()}
                              </span>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </>
      )}
    </div>
  );
};

export default Server;
