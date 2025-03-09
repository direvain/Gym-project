const onSubmit = async (values: any) => {
  if(!values.playerName) {
    return handleError("ادخل اسم اللاعب ");
  }

  try {
    const response = await fetch(
      `http://localhost:8080/Members/SearchforMembersName/${values.playerName}`,
      { method: "GET" }
    );
    
    if (response.ok) {
      const results = await response.json();
      
      if (Array.isArray(results) && results.length > 0) {
        // Multiple results found - store them for display
        setPlayerResults(results);
        // Select the first player to display
        const player = results[0];
        setQrData({
          value: player.qrCodeValue,
          name: player.name,
          startDate: player.subscriptionDurationStart,
          endDate: player.subscriptionDurationEnd,
          age: player.age,
          weight: player.weight,
          phoneNumber: player.phoneNumber,
          downloadName: player.name,
        });
        setShowPlayerQrcode(true);
      } else {
        // No results
        handleError("لا يوجد لاعب");
        setShowPlayerQrcode(false);
        setPlayerResults([]);
      }
    } else {
      handleError("لا يوجد لاعب");
      setShowPlayerQrcode(false);
      setPlayerResults([]);
    }
  } catch(err) {
    handleError("حدث خطأ في البحث");
    setShowPlayerQrcode(false);
  }
  
  reset(); // Clear the form after submission
};


const handleSelectPlayer = (player: any) => {
  setQrData({
    value: player.qrCodeValue,
    name: player.name,
    startDate: player.subscriptionDurationStart,
    endDate: player.subscriptionDurationEnd,
    age: player.age,
    weight: player.weight,
    phoneNumber: player.phoneNumber,
    downloadName: player.name,
  });
  setShowPlayerQrcode(true);
};
