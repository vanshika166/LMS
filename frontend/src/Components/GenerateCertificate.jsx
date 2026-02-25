import { Document, Page, Text, StyleSheet, Image, pdf } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    position: 'relative',
    padding: 0,          // ensure no extra padding that could push content to a new page
    margin: 0,
  },
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover'   // make sure background covers the whole page with no overflow
  },
  name: {
    position: 'absolute',
    top: 248,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 45,
    fontWeight: 'semibold',
    color: '#000000',
  },
  course: {
    position: 'absolute',
    top: 355,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 22,
    color: '#333',
    paddingHorizontal: 80,
  },
  date: {
    position: 'absolute',
    top: 448,
    left: 220,
    fontSize: 16,
    color: '#333',
  },
  certId: {
    position: 'absolute',
    top: 448,
    right: 200,
    fontSize: 15,
    color: '#333',
  }
});

const MyDocument = ({ studentName, courseName, date, certId }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      {/* Make the image fixed so it is rendered as the page background and won't push other content to a new page */}
      <Image style={styles.bg} src="/certificate-bg.png" fixed />
      
      {/* All text placed on the same Page */}
      <Text style={styles.name}>{studentName}</Text>
      <Text style={styles.course}>{courseName}</Text>
      <Text style={styles.date}>{date}</Text>
      <Text style={styles.certId}>{certId}</Text>
    </Page>
  </Document>
);

const GenerateCertificate = ({button, studentName, courseName }) => {
  const download = async () => {
    const date = new Date().toLocaleDateString('en-GB');
    const certId = 'CERT-' + Math.random().toString(36).slice(2, 8).toUpperCase();

    const doc = <MyDocument studentName={studentName} courseName={courseName} date={date} certId={certId} />;
    const asPdf = pdf();
    asPdf.updateContainer(doc);
    const blob = await asPdf.toBlob(); // single blob for one Document with one Page

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${studentName}-Certificate.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={download}
     className='p-2 px-5 font-xl bg-[#2A27F3] text-white rounded-xl cursor-pointer'>
      {button}
    </button>
  );
};

export default GenerateCertificate;