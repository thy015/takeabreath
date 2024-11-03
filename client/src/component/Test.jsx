import React from 'react';

const Test = () => {
    const styles = {
        container: {
            color: '#000',
            padding: '20px',
            textAlign: 'center',
            minHeight: '100vh',
            fontFamily: 'afacad',
        },
        header: {
            backgroundColor: '#CBDCEB',
            padding: '20px 0',
            textAlign: 'center',
            fontFamily: 'lobster',
            marginBottom: '40px',
            borderBottomLeftRadius:'40px',
            borderBottomRightRadius:'40px',
        },
        logo: {
            fontSize: '30px',
            margin: 0,
        },
        content: {
            backgroundColor: '#fff',
            padding: '40px 20px',
            maxWidth: '1000px',
            margin: 'auto',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        },
        greeting: {
            fontSize: '30px',
            color: '#4a4a4a',
            margin: '0 0 10px',
            fontWeight: 600,
            textAlign: 'left',
        },
        message: {
            color: '#1A4297',
            fontSize: '20px',
            margin: '0 0 20px',
            textAlign: 'left',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '20px',
        },
        th: {
            borderBottom: '1px solid #ddd',
            fontWeight: 'bold',
            padding: '8px',
            color: '#4a4a4a',
        },
        td: {
            borderBottom: '1px solid #ddd',
            padding: '8px',
            color: '#333',
        },
        note: {
            fontSize: '16px',
            color: '#1A4297',
        },
        signature: {
            fontSize: '20px',
            fontStyle: 'italic',
            color: '#333',
            marginTop: '25px',
            textAlign: 'left',
        },
        footer: {
            marginTop: '40px',
            backgroundColor:'#CBDCEB',
            padding: '30px',
            borderTopLeftRadius:'40px',
            borderTopRightRadius:'40px',
        },
        footerText: {
            fontSize: '20px',
            display:'flex',
            justifyContent:'center',
            alignItems: 'center',
        },
        footerLink: {
            color: '#4a90e2',
            textDecoration: 'none',
        },
    };
    return (
        <>
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.logo}>Take A Breath</h1>
                </div>
                <div style={styles.content}>
                    <h2 style={styles.greeting}>Dear Tan Phuc,</h2>
                    <p style={styles.message}>Thank you for choosing TAB's services!</p>
                    <p>Your services ordered:</p>
                    <table style={styles.table}>
                        <thead>
                        <tr>
                            <th style={styles.th}>Service</th>
                            <th style={styles.th}>Item</th>
                            <th style={styles.th}>Quantity</th>
                            <th style={styles.th}>At</th>
                            <th style={styles.th}>Price</th>
                            <th style={styles.th}>CheckInDay</th>
                            <th style={styles.th}>CheckOutDay</th>
                            <th style={styles.th}>For total</th>
                            <th style={styles.th}>Payment Method</th>

                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td style={styles.td}>Đặt phòng</td>
                            <td style={styles.td}>Phòng...</td>
                            <td style={styles.td}>2</td>
                            <td style={styles.td}>Hotel...</td>
                            <td style={styles.td}>50$</td>
                            <td style={styles.td}>CheckInDay</td>
                            <td style={styles.td}>CheckOutDay</td>
                            <td style={styles.td}>2 days</td>
                            <td style={styles.td}>Paypal</td>
                        </tr>
                        </tbody>
                    </table>
                    <p>Your personal information:</p>
                    <table style={styles.table}>
                        <thead>
                        <tr>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>I-Card</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Phone Number</th>
                            <th style={styles.th}>Gender</th>
                            <th style={styles.th}>Birthday</th>

                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td style={styles.td}>Thy</td>
                            <td style={styles.td}>079333628172</td>
                            <td style={styles.td}>thymai.1510@gmail.com</td>
                            <td style={styles.td}>099278391</td>
                            <td style={styles.td}>Gay</td>
                            <td style={styles.td}>15/10/2004</td>
                        </tr>
                        </tbody>
                    </table>
                    <p style={styles.signature}>Yours truly,<br/>Take A Breath</p>
                    <div style={styles.note}>This is an auto-generate email, please do not reply to this.</div>
                </div>
                <footer style={styles.footer}>
                    <div style={styles.footerText}>
                    © 2024 <span style={styles.footerLink}>Take A Breath</span>. All rights reserved.
                    </div>
                </footer>
            </div>
        </>
    )
}
export default Test;