import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import L from 'leaflet';

// Fix leaflet icon
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function IssuesMap({ reports }: { reports: any[] }) {
  // Center roughly on Nepal
  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-neon border border-dark-border z-0">
      <MapContainer center={[28.3949, 84.1240]} zoom={7} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {reports.filter(r => r.lat && r.lng && r.status !== 'rejected').map(report => (
          <Marker key={report.id} position={[report.lat, report.lng]} icon={customIcon}>
            <Popup>
              <div className="p-1 min-w-[200px]">
                <h3 className="font-bold text-sm text-slate-800">{report.title}</h3>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-1 text-white ${report.status === 'resolved' ? 'bg-green-600' : 'bg-primary-500'}`}>
                  {report.status.toUpperCase()}
                </span>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2">{report.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
