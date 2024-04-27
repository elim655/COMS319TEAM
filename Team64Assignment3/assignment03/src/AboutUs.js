import React from "react";

const AboutUs = () => {
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', margin: '0 auto', maxWidth: '600px', padding: '20px' }}>
            <h1 style={{ textAlign: 'center' }}>Authors Information</h1>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <tr>
                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Course Name:</th>
                    <td style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>SE/ComS319 Construction of User Interfaces, Spring 2024</td>
                </tr>
                <tr>
                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Student Names:</th>
                    <td style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Edmund Lim, Dallas Kuiper</td>
                </tr>
                <tr>
                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Emails:</th>
                    <td style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                        <a href="mailto:elim655@iastate.edu" style={{ textDecoration: 'none', color: '#000' }}>elim655@iastate.edu</a>,&nbsp;
                        <a href="mailto:dmkuiper@iastate.edu" style={{ textDecoration: 'none', color: '#000' }}>dmkuiper@iastate.edu</a>
                    </td>
                </tr>
                <tr>
                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date:</th>
                    <td style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>April 26, 2024</td>
                </tr>
                <tr>
                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Professor's Name:</th>
                    <td style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Prof. Ali Jannesari</td>
                </tr>
            </table>
        </div>
    );
};

export default AboutUs;
