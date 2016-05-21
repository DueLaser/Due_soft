app.controller('loadFileCtrl', function($scope, $state, hotkeys,
  settingsService, machineService, fileService) {

  $scope.machineService = machineService;
  $scope.fileService = fileService;
  //$scope.settings = settingsService.settings;

  $scope.velocidade = 2000;
  $scope.potencia=255;
  $scope.passes=1;

   $scope.textovelocidade="Velocidade em mm/s";

  var header = {
    commandSequence: [
    "M05 S0\n",
    "M8\n",
    "G90\n",
    "G21\n",
    "G1 F10000\n",
    "G1 X2.3911 Y15.7586\n"],
  };

  var envia = {
    commandSequence: [],
  };

  var postamble = {
    commandSequence: [
    "M05 S0\n",
    "G1 F10000\n",
    "G0 X0 Y0 M9\n"
    ],
  }; 



  $scope.$watch( 'velocidade',
    function(newValue, oldValue){
      $scope.velocidade = newValue; 
       if($scope.velocidade<200) 
        $scope.textovelocidade="Velocidade mínima: 200 mm/s";
      else if($scope.velocidade>5000) 
        $scope.textovelocidade="Velocidade máxima: 5000 mm/s";    
      console.log($scope.velocidade);
    }
    );

  $scope.$watch( 'potencia',
    function(newValue, oldValue){
      console.log('Potencia mudou');
      $scope.potencia = newValue;
    }
    );

  $scope.$watch( 'passes',
    function(newValue, oldValue){
      console.log('N passes mudou');
      $scope.passes = newValue;
    }
    );

  $scope.retornaVelocidade=function(){
    return $scope.velocidade;
  };

  $scope.enviaTeste=function(){
    console.log("Enviando Comandos");
     if($scope.velocidade<200) 
        $scope.velocidade=200;
      else if($scope.velocidade>5000) 
        $scope.velocidade=5000;

       if($scope.potencia<41) 
        $scope.potencia=41;
      else if($scope.potencia>255) 
        $scope.potencia=255;

       if($scope.passes<1) 
        $scope.passes=1;
      else if($scope.passes>100) 
        $scope.passes=100;

    envia.commandSequence=[
    "M03 S"+$scope.potencia+"\n",
    "G1 F"+$scope.velocidade+"\n",
    "G1 X14.6089 Y15.7586\n",
    "G2 X15.3675 Y15.3675 I0. J-0.9312\n",
    "G2 X15.7586 Y14.1439 I-1.7186 J-1.2236\n",
    "G1 X15.7586 Y2.8561\n",
    "G2 X15.3675 Y1.6325 I-2.1097 J0.\n",
    "G2 X14.6089 Y1.2414 I-0.7586 J0.5401\n",
    "G1 X2.3911 Y1.2414\n",
    "G2 X1.6325 Y1.6325 I0. J0.9312\n",
    "G2 X1.2414 Y2.8561 I1.7186 J1.2236\n",
    "G1 X1.2414 Y14.1439\n",
    "G2 X1.6325 Y15.3675 I2.1097 J0.\n",
    "G2 X2.3911 Y15.7586 I0.7586 J-0.5401\n",
    "G1 X2.3911 Y15.7586\n",
    ];
    machineService.enqueueCommands(header.commandSequence);
    for(i=0;i<$scope.passes;i++){
      machineService.enqueueCommands(envia.commandSequence);
    }
    machineService.enqueueCommands(postamble.commandSequence);

    //$state.go("controlpanel")
  };

});
