import React, { useEffect, useState } from "react";
import {
  CCard, CCardBody, CCol, CCardHeader, CRow, CSpinner,
  CFormInput, CTable, CTableBody, CTableHeaderCell,
  CTableRow, CTableDataCell, CTableHead, CButton
} from "@coreui/react";
import axios from "axios";
import "../../css/Zones.css";
import "../../css/Records.css";

// Debounce Hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// Editable Cell with Edit/Save/Cancel
const EditableCell = ({ value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    setIsEditing(false);
    if (tempValue !== value) onSave(tempValue);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempValue(value);
  };

  return (
    <CTableDataCell>
      {isEditing ? (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            autoFocus
          />
          <CButton size="sm" color="success" onClick={handleSave}>Save</CButton>
          <CButton size="sm" color="danger" onClick={handleCancel}>Cancel</CButton>
        </div>
      ) : (
        <div onClick={() => setIsEditing(true)}>
          {(value || "").toString().length > 100
            ? (value || "").toString().slice(0, 100) + '...'
            : (value || "").toString()}
        </div>
      )}
    </CTableDataCell>
  );
};

const Dashboard = () => {
  const [zones, setZones] = useState([]);
  const [records, setRecords] = useState([]);
  const [zoneId, setZoneId] = useState(null);
  const [zoneSearch, setZoneSearch] = useState("");
  const [recordSearch, setRecordSearch] = useState("");
  const [loadingZones, setLoadingZones] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(false);

  const API_TOKEN = "GTa1hdQLmCuys8oWOxLebMqUAuCWk5E7";
  const debouncedZoneSearch = useDebounce(zoneSearch, 500);
  const debouncedRecordSearch = useDebounce(recordSearch, 500);

  useEffect(() => {
    const fetchZones = async () => {
      setLoadingZones(true);
      try {
        const res = await axios.get("https://dns.hetzner.com/api/v1/zones", {
          headers: { "Auth-API-Token": API_TOKEN },
        });
        setZones(res.data.zones || []);
      } catch (err) {
        console.error("Failed to fetch zones");
      } finally {
        setLoadingZones(false);
      }
    };
    fetchZones();
  }, []);

  useEffect(() => {
    if (!zoneId) return;
    const fetchRecords = async () => {
      setLoadingRecords(true);
      try {
        const res = await axios.get(`https://dns.hetzner.com/api/v1/records?zone_id=${zoneId}`, {
          headers: { "Auth-API-Token": API_TOKEN },
        });
        setRecords(res.data.records || []);
      } catch (err) {
        console.error("Failed to fetch records");
      } finally {
        setLoadingRecords(false);
      }
    };
    fetchRecords();
  }, [zoneId]);

  const filteredZones = zones.filter((z) =>
    z.name.toLowerCase().includes(debouncedZoneSearch.toLowerCase())
  );

  const filteredRecords = records.filter((r) =>
    r.name.toLowerCase().includes(debouncedRecordSearch.toLowerCase())
  );

  // ✅ Corrected API Update
  const handleEdit = async (record, field, newValue) => {
    const updatedRecord = { ...record, [field]: newValue };
    try {
      await axios.put(`https://dns.hetzner.com/api/v1/records/${record.id}`, {
        zone_id: updatedRecord.zone_id,
        type: updatedRecord.type,
        name: updatedRecord.name,
        value: updatedRecord.value,
        ttl: Number(updatedRecord.ttl)
      }, {
        headers: { "Auth-API-Token": API_TOKEN },
      });

      setRecords((prev) =>
        prev.map((rec) => (rec.id === record.id ? updatedRecord : rec))
      );
    } catch (err) {
      console.error("Failed to update record", err.response?.data || err.message);
    }
  };

  return (
    <>
      {!zoneId ? (
        <CRow>
          <CCol xs>
            <CCard className="mb-4 card-container">
              <CCardBody className="zones-container">
                {loadingZones ? <CSpinner color="info" /> : (
                  <>
                    <CCardHeader className="sticky-header">
                      <span className="card-title">Your Zones</span>
                      <CFormInput
                        type="text"
                        placeholder="Search zones..."
                        value={zoneSearch}
                        onChange={(e) => setZoneSearch(e.target.value)}
                        className="search-input"
                      />
                    </CCardHeader>
                    <CTable>
                      <CTableBody>
                        {filteredZones.map((zone) => (
                          <CTableRow
                            key={zone.id}
                            className="one-zones-container"
                            onClick={() => setZoneId(zone.id)}
                          >
                            <CTableDataCell>{zone.name}</CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      ) : (
        <CRow>
          <CCol xs>
            <CCard className="mb-4 card-container">
              <CCardHeader className="sticky-records">
                <span className="card-title">Records</span>
                <CFormInput
                  type="text"
                  placeholder="Search records..."
                  value={recordSearch}
                  onChange={(e) => setRecordSearch(e.target.value)}
                  className="search-input"
                />
              </CCardHeader>
              <CCardBody className="records-container">
                {loadingRecords ? <CSpinner color="info" /> : filteredRecords.length === 0 ? (
                  <p>No records found.</p>
                ) : (
                  <CTable>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Name</CTableHeaderCell>
                        <CTableHeaderCell>Type</CTableHeaderCell>
                        <CTableHeaderCell>Value</CTableHeaderCell>
                        <CTableHeaderCell>TTL</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {filteredRecords.map((record) => (
                        <CTableRow key={record.id} className="one-record-container">
                          <EditableCell
                            value={record.name}
                            onSave={(newValue) => handleEdit(record, 'name', newValue)}
                          />
                          <EditableCell
                            value={record.type}
                            onSave={(newValue) => handleEdit(record, 'type', newValue)}
                          />
                          <EditableCell
                            value={record.value}
                            onSave={(newValue) => handleEdit(record, 'value', newValue)}
                          />
                          <EditableCell
                            value={record.ttl}
                            onSave={(newValue) => handleEdit(record, 'ttl', newValue)}
                          />
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}
    </>
  );
};

export default Dashboard;
