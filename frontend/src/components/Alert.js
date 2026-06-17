import React from 'react';

function Alert(props) {
  const getBadgeColor = (type) => {
    if (type === 'success') return 'bg-success';
    if (type === 'danger') return 'bg-danger';
    return 'bg-warning';
  };

  return (
    props.alert && (
      <div className="floating-alert glass-card">
        <span className={`badge ${getBadgeColor(props.alert.type)} p-2 rounded-circle`} style={{ width: '10px', height: '10px', display: 'inline-block' }}></span>
        <div style={{ flex: 1 }}>
          <strong style={{ color: props.alert.type === 'success' ? '#10b981' : '#f43f5e' }}>
            {props.alert.type === 'success' ? 'Success' : 'Error'}
          </strong>{' '}
          <span style={{ fontSize: '0.95rem', marginLeft: '5px' }}>{props.alert.msg}</span>
        </div>
      </div>
    )
  );
}

export default Alert;
